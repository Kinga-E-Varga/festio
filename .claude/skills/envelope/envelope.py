"""The envelope's tools: check the editable SVG, list what changed, build it into the app.

    python3 -I envelope.py check                  # layers, colours, labels
    python3 -I envelope.py diff                   # what changed since the last build
    python3 -I envelope.py build-app              # the drawing into the app
    python3 -I envelope.py mark-built             # record the SVG the app was built from

Standard library only. The editable SVG is the one master copy of the drawing;
the app holds the UI and the animation (src/components/envelope/).
"""
import copy, json, math, re, shutil, subprocess, sys
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ASSETS = HERE / "drawing"
EDIT = ASSETS / "envelope-edit.svg"
BUILT = ASSETS / "envelope-built.svg"

SVG = "http://www.w3.org/2000/svg"
INK = "http://www.inkscape.org/namespaces/inkscape"
SOD = "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
XL = "http://www.w3.org/1999/xlink"
LABEL = f"{{{INK}}}label"

# The source colours that stand for the roles. #847246 is the cast shadow: only inside a
# "cast shadow" group, the tag's shadow group, or beside the tag in its swing group.
ROLES = {
    "#ccb885": "var(--paper)",
    "#617140": "var(--liner)",
    "#8c5a2b": "var(--string)",
    "#d1c598": "var(--tag)",
    "#a02c2c": "var(--seal)",
    "#847246": "var(--cast)",
}
BACKGROUND = "#f0e9cf"
CAST = "#847246"

# Layers, bottom to top, exactly as the page draws them.
LAYERS = [
    "Background (not part of the envelope)",
    "Back · open",
    "Back · closed",
    "Side flaps · shared",
    "Side flaps · open",
    "Side flaps · closed",
    "Side flap shading · shared",
    "Bottom flap · shared",
    "Bottom flap · open",
    "Bottom flap · closed",
    "Flap · closed",
    "Decoration · shared",
]
POCKET = LAYERS[3:10]

# The decoration's groups, bottom to top, exactly as the page draws them: the group a
# shape sits in decides how it moves, whatever its own label.
TAG_SHADOW = "tag shadow · lifts less, blurs"
TAG_SWINGS = "tag · swings"
ENV_SHADOWS = "shadows on the envelope"
ON_ENV = "on the envelope"
DECO_GROUPS = [TAG_SHADOW, TAG_SWINGS, ENV_SHADOWS, ON_ENV]

# The file's own coordinates: the fold the flap turns on, and the closed envelope's
# body (the hover and click area, and the centre the hover grows from).
FOLD = 214.514
BODY = {"x0": 103, "x1": 197, "y0": FOLD, "y1": 274}


def local(tag):
    return tag.split("}")[1] if "}" in tag else tag


def load(path=EDIT):
    return ET.parse(path).getroot()


def drop_dead_fills(root):
    """A group's fill shows only on shapes without their own. Inkscape leaves one behind
    when a colour is picked with the whole group selected; where every shape inside has
    its own fill, it never shows, so it goes."""
    for g in root.iter(f"{{{SVG}}}g"):
        st = styles(g)
        if "fill" not in st:
            continue
        shapes = [el for el in g.iter() if local(el.tag) not in ("g", "title", "desc")]
        if shapes and all("fill" in styles(el) or el.get("fill") for el in shapes):
            st.pop("fill")
            g.set("style", ";".join(f"{a}:{b}" for a, b in st.items()))


def drop_dead_stops(root):
    """A gradient stop's colour means nothing on any other element. Inkscape's Stroke to Path
    writes every style property out, a black stop-color among them; it never shows, so it goes."""
    for el in root.iter():
        st = styles(el)
        if local(el.tag) == "stop" or not ({"stop-color", "stop-opacity"} & st.keys()):
            continue
        st.pop("stop-color", None)
        st.pop("stop-opacity", None)
        el.set("style", ";".join(f"{a}:{b}" for a, b in st.items()))


def layers(root):
    return {
        g.get(LABEL): g
        for g in root
        if local(g.tag) == "g" and g.get(f"{{{INK}}}groupmode") == "layer"
    }


def label(el):
    return el.get(LABEL) or ""


def styles(el):
    out = {}
    for kv in (el.get("style") or "").split(";"):
        if ":" in kv:
            k, v = kv.split(":", 1)
            out[k.strip()] = v.strip()
    return out


def colours(el):
    """Every colour an element uses, from its style and its fill/stroke attributes."""
    s = (el.get("style") or "") + " " + (el.get("fill") or "") + " " + (el.get("stroke") or "")
    return {c.lower() for c in re.findall(r"#[0-9a-fA-F]{6}\b", s)}


# ---------- check ----------
def check():
    root = load()
    drop_dead_fills(root)
    drop_dead_stops(root)
    found = layers(root)
    problems = []
    for name in LAYERS:
        if name not in found:
            problems.append(f"Missing layer: {name}")
    for name in found:
        if name not in LAYERS:
            problems.append(f"Unknown layer (the page has no place for it yet): {name}")
    groups = {
        "Back · open": ["cast shadow", "inside + open flap"],
        "Back · closed": ["cast shadow"],
        "Flap · closed": ["closed flap"],
    }
    for name, need in groups.items():
        if name in found:
            have = {label(c) for c in found[name]}
            for n in need:
                if n not in have:
                    problems.append(f'Layer "{name}" has no group labelled "{n}"')
    if "Decoration · shared" in found:
        problems += check_decoration(found["Decoration · shared"])
    for name, g in found.items():
        # The background colour is only for seeing the envelope in Inkscape; on the
        # envelope it would stay that colour in every palette.
        allowed = set(ROLES) | ({BACKGROUND} if name == LAYERS[0] else set())
        cast = {x for el in g.iter() if is_cast(el) for x in el.iter()}
        if name == "Decoration · shared":
            cast |= tag_hard_shapes(g)
        for el in g.iter():
            where = label(el) or local(el.tag)
            for c in colours(el) - allowed:
                problems.append(f'New colour {c} in "{name}" › {where}: not one of the roles')
            if CAST in colours(el) and el not in cast:
                problems.append(f'{CAST} in "{name}" › {where}: only cast shadows use it')
    if problems:
        print("\n".join(problems))
        return 1
    print("OK: every layer is there and only role colours are used.")
    return 0


def deco_groups(g):
    """The decoration's four groups by label, each a list of the groups with that label."""
    return {n: [el for el in g.iter() if local(el.tag) == "g" and label(el) == n] for n in DECO_GROUPS}


def check_decoration(g):
    problems = []
    groups = deco_groups(g)
    for n, found in groups.items():
        if len(found) != 1:
            problems.append(
                f'"Decoration · shared" needs one group labelled "{n}" (has {len(found)})'
            )
    if problems:
        return problems
    order = [el for el in g.iter() if el in [f[0] for f in groups.values()]]
    if [label(el) for el in order] != DECO_GROUPS:
        problems.append(
            "Decoration's groups are out of order. Bottom to top (in Inkscape's Objects panel, "
            "top to bottom is the reverse): " + ", ".join(DECO_GROUPS)
        )
    if not any(local(el.tag) == "g" and label(el) == "tag" for el in groups[TAG_SWINGS][0].iter()):
        problems.append(f'"{TAG_SWINGS}" has no group labelled "tag" (the tag itself)')
    inside = {x for f in groups.values() for x in f[0].iter()}
    for el in g.iter():
        if local(el.tag) in ("path", "rect", "circle", "ellipse", "use", "text", "image") and el not in inside:
            problems.append(
                f'"{label(el) or local(el.tag)}" in Decoration is in none of its four groups, so it has no place on the page'
            )
    return problems


def tag_hard_shapes(g):
    """Everything in the tag's swing group beside the tag itself: shadows that hug the tag."""
    swing = deco_groups(g)[TAG_SWINGS]
    if len(swing) != 1:
        return set()
    tag = next((el for el in swing[0].iter() if local(el.tag) == "g" and label(el) == "tag"), None)
    return set(swing[0].iter()) - set(tag.iter() if tag is not None else []) - {swing[0]}


# ---------- diff ----------
def items(root):
    """Every element, keyed by its layer and labels (or position where it has no label)."""
    out = {}

    def walk(el, path):
        counts = {}
        for c in el:
            name = label(c) or local(c.tag)
            counts[name] = counts.get(name, 0) + 1
            key = f"{path} › {name}" + (f" #{counts[name]}" if counts[name] > 1 else "")
            out[key] = c
            walk(c, key)

    for name, g in layers(root).items():
        out[name] = g
        walk(g, name)
    return out


def diff():
    if not BUILT.exists():
        print(f"No record of the last build ({BUILT.name}); nothing to compare with.")
        return 0
    old, new = items(load(BUILT)), items(load())
    lines = []
    for k in new.keys() - old.keys():
        lines.append(f"Added: {k}")
    for k in old.keys() - new.keys():
        lines.append(f"Removed: {k}")
    for k in sorted(new.keys() & old.keys()):
        a, b = old[k], new[k]
        if a.get("d") != b.get("d"):
            lines.append(f"Shape changed: {k}")
        for attr in ("transform", "x", "y", "width", "height", "cx", "cy", "r", "clip-path"):
            if a.get(attr) != b.get(attr):
                lines.append(f"{attr} changed: {k}: {a.get(attr)} → {b.get(attr)}")
        sa, sb = styles(a), styles(b)
        for p in sorted(set(sa) | set(sb)):
            if sa.get(p) != sb.get(p):
                lines.append(f"{p} changed: {k}: {sa.get(p)} → {sb.get(p)}")
    root = load()
    old_defs = {c.get("id"): ET.tostring(c) for d in load(BUILT).iter(f"{{{SVG}}}defs") for c in d}
    new_defs = {c.get("id"): ET.tostring(c) for d in root.iter(f"{{{SVG}}}defs") for c in d}
    for i in sorted(set(old_defs) | set(new_defs)):
        if old_defs.get(i) != new_defs.get(i):
            what = "Added" if i not in old_defs else "Removed" if i not in new_defs else "Changed"
            lines.append(f"{what} definition (clip or blur): {i}")
    print("\n".join(lines) if lines else "No changes since the last build.")
    return 0


# ---------- build ----------
def lift_blends(el):
    """Chrome draws a clipped group on its own, so a blend inside it would have nothing
    to blend with. When every child of a clipped group blends the same way, the group
    carries the blend instead."""
    for c in el.iter():
        if local(c.tag) != "g" or not c.get("clip-path"):
            continue
        kids = list(c)
        modes = {styles(k).get("mix-blend-mode", "normal") for k in kids}
        if kids and len(modes) == 1 and modes != {"normal"}:
            mode = modes.pop()
            for k in kids:
                st = styles(k)
                st.pop("mix-blend-mode", None)
                k.set("style", ";".join(f"{a}:{b}" for a, b in st.items()))
            st = styles(c)
            st["mix-blend-mode"] = mode
            c.set("style", ";".join(f"{a}:{b}" for a, b in st.items()))


def recolour(s):
    for hexv, var in ROLES.items():
        s = re.sub(hexv, var, s, flags=re.I)
    return s


SHADING = {"multiply": "mul", "screen": "scr"}


def shading(v, blend):
    """A shadow (multiply) or highlight (screen) takes its role's shading colour instead
    of the role colour itself; the page sets those per shading option."""
    st = dict(kv.split(":", 1) for kv in v.split(";") if ":" in kv)
    suffix = SHADING[blend]
    for k in ("fill", "stroke"):
        if k in st:
            st[k] = re.sub(r"var\(--(?!cast\))([a-z-]+)\)", rf"var(--\1-{suffix})", st[k])
    return ";".join(f"{a}:{b}" for a, b in st.items())


def is_cast(el):
    """A shadow cast on the background: the envelope's or the tag's."""
    return label(el) in ("cast shadow", TAG_SHADOW)


def ser(el, cast=False, cls=None, blend=None):
    """An element as page markup: Inkscape's own attributes dropped, colours as roles."""
    tag = local(el.tag)
    cast = cast or is_cast(el)
    # Inkscape may write "normal" on a shape inside a blended group: it changes nothing.
    own = styles(el).get("mix-blend-mode")
    blend = own if own and own != "normal" else blend
    blend = blend if blend in SHADING else None
    attrs = []
    if cls:
        attrs.append(f'class="{cls}"')
    for k, v in el.attrib.items():
        if k.startswith(f"{{{INK}}}") or k.startswith(f"{{{SOD}}}"):
            continue
        if k == f"{{{XL}}}href":
            k = "href"
        elif "}" in k:
            continue
        if k in ("style", "fill", "stroke"):
            v = recolour(v)
        if k == "style" and blend and not cast and tag != "g":
            v = shading(v, blend)
        attrs.append(f'{k}="{v}"')
    inner = "".join(ser(c, cast, blend=blend) for c in el)
    a = (" " + " ".join(attrs)) if attrs else ""
    return f"<{tag}{a}>{inner}</{tag}>" if inner else f"<{tag}{a}/>"


def by_label(g, name):
    for c in g:
        if label(c) == name:
            return c
    raise SystemExit(f'Layer "{label(g)}" has no group labelled "{name}". Run check.')


INSIDE_SHADOW = "inside shadow"


def split_inside_shadow(back):
    """The inside and its shadow apart, both keeping every clip around the shadow: the card
    sits between them, so the shadow the side flaps cast on the liner falls on the card too."""
    rest = copy.deepcopy(back)
    for parent in rest.iter():
        for c in list(parent):
            if label(c) == INSIDE_SHADOW:
                parent.remove(c)
    shade = copy.deepcopy(back)

    def prune(el):
        keep = False
        for c in list(el):
            if label(c) == INSIDE_SHADOW or prune(c):
                keep = True
            else:
                el.remove(c)
        return keep

    if not prune(shade):
        raise SystemExit(f'No shape labelled "{INSIDE_SHADOW}" in "inside + open flap".')
    return ser(rest), ser(shade)


def split_decoration(g):
    """The decoration in five parts, back to front, from its four groups: the tag's shadow,
    the shadows that hug the tag (everything in its swing group beside the tag itself), the
    tag, the shadows on the envelope (they multiply onto the tag too), and the rest. Each is
    a layer of its own: the tag and its shadows swing, under the string that runs through
    its hole."""
    groups = {n: f[0] for n, f in deco_groups(g).items()}
    hard = tag_hard_shapes(g)
    leaves = [el for el in g.iter() if el is not g and local(el.tag) != "g"]

    def part(keep):
        """The decoration with only the shapes in keep, and the groups that hold them."""
        kept = {id(el) for el in leaves if keep(el)}

        def copy(el):
            if local(el.tag) != "g":
                return ET.fromstring(ET.tostring(el)) if id(el) in kept else None
            kids = [k for k in (copy(c) for c in el) if k is not None]
            if not kids:
                return None
            out = ET.Element(el.tag, el.attrib)
            out.extend(kids)
            return out

        return "".join(ser(k) for k in (copy(c) for c in g) if k is not None)

    within = {n: set(grp.iter()) for n, grp in groups.items()}
    return {
        "tagShade": part(lambda el: el in within[TAG_SHADOW]),
        "tagHard": part(lambda el: el in hard),
        "tag": part(lambda el: el in within[TAG_SWINGS] and el not in hard),
        "decoShade": part(lambda el: el in within[ENV_SHADOWS]),
        "deco": part(lambda el: el in within[ON_ENV]),
    }


def mul(p, q):
    """Two transform matrices (a, b, c, d, e, f) as one: q first, then p."""
    return (
        p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1],
        p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3],
        p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5],
    )


def matrix(transform):
    """An SVG transform attribute as a matrix (a, b, c, d, e, f)."""
    m = (1, 0, 0, 1, 0, 0)
    for name, args in re.findall(r"(\w+)\s*\(([^)]*)\)", transform or ""):
        v = [float(x) for x in re.split(r"[\s,]+", args.strip()) if x]
        if name == "matrix":
            q = tuple(v)
        elif name == "translate":
            q = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0)
        elif name == "scale":
            q = (v[0], 0, 0, v[1] if len(v) > 1 else v[0], 0, 0)
        elif name == "rotate":
            a = math.radians(v[0])
            cx, cy = (v[1], v[2]) if len(v) > 2 else (0, 0)
            q = mul(mul((1, 0, 0, 1, cx, cy), (math.cos(a), math.sin(a), -math.sin(a), math.cos(a), 0, 0)), (1, 0, 0, 1, -cx, -cy))
        else:
            raise SystemExit(f"Unknown transform: {name}")
        m = mul(m, q)
    return m


def find(el, test, m=(1, 0, 0, 1, 0, 0)):
    """Every element under el that passes test, with the matrix from its own coordinates
    (its transform included) to el's."""
    found = []
    for c in el:
        cm = mul(m, matrix(c.get("transform")))
        if test(c):
            found.append((c, cm))
        found += find(c, test, cm)
    return found


def apply(m, x, y):
    return m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]


def subpaths(d):
    """Each subpath of a path's d as the points it passes through (ends and control points),
    in the path's own coordinates. Enough to find a subpath's box, not to draw it."""
    toks = re.findall(r"[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?", d)
    out, pts = [], []
    x = y = sx = sy = 0.0
    i, cmd = 0, None
    sizes = {"m": 2, "l": 2, "h": 1, "v": 1, "c": 6, "s": 4, "q": 4, "t": 2, "a": 7, "z": 0}
    while i < len(toks):
        if toks[i].isalpha():
            cmd = toks[i]
            i += 1
            if cmd in "zZ":
                x, y = sx, sy
                if pts:
                    out.append(pts)
                pts = []
                continue
        n = sizes[cmd.lower()]
        v = [float(t) for t in toks[i : i + n]]
        i += n
        rel = cmd.islower()
        c = cmd.lower()
        if c == "h":
            x = v[0] + (x if rel else 0)
        elif c == "v":
            y = v[0] + (y if rel else 0)
        elif c == "a":
            x, y = v[5] + (x if rel else 0), v[6] + (y if rel else 0)
        else:
            for k in range(0, n, 2):
                px, py = v[k] + (x if rel else 0), v[k + 1] + (y if rel else 0)
                pts.append((px, py))
            x, y = pts[-1]
        if c == "m":
            if pts[:-1]:
                out.append(pts[:-1])
                pts = pts[-1:]
            sx, sy = x, y
            cmd = "l" if rel else "L"
        pts.append((x, y))
    if pts:
        out.append(pts)
    return out


def hole_in(el):
    """The tag's hole in el's coordinates: the centre of the hole cut in the tag's paper
    (the paper's second subpath). The tag swings around it."""
    groups = find(el, lambda c: local(c.tag) == "g" and label(c) == "tag")
    found = [
        (p, mul(gm, pm))
        for g, gm in groups[:1]
        for p, pm in find(g, lambda c: local(c.tag) == "path" and label(c) == "tag")
    ]
    if not found:
        raise SystemExit('No path labelled "tag" (the tag\'s paper) in the group "tag".')
    paper, m = found[0]
    parts = subpaths(paper.get("d"))
    if len(parts) < 2:
        raise SystemExit('The tag\'s paper has no hole cut in it (no second subpath).')
    xs, ys = zip(*parts[1])
    return apply(m, (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)


def hole(root):
    x, y = hole_in(root)
    return {"x": x, "y": y}


def global_matrix(root, el):
    """The matrix from el's own coordinates (its transform included) to the file's."""
    parents = {c: p for p in root.iter() for c in p}
    m = matrix(el.get("transform"))
    while el in parents:
        el = parents[el]
        m = mul(matrix(el.get("transform")), m)
    return m


def inverse(m):
    a, b, c, d, e, f = m
    det = a * d - b * c
    return (d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det)


def as_matrix(m):
    return "matrix(" + ",".join(f"{v:.8g}" for v in m) + ")"


def trim_strings(root):
    """The page draws the string over the tag, so the string stays in the hole while the
    tag swings. Past the hole the string goes behind the tag: everything on the envelope
    (and its shadows) is trimmed to the strings' side of a line through the hole, plus
    everywhere off the tag's paper (the hole included). Only the strings reach onto the
    paper, so nothing else loses anything. The strings' side is the way the tag points
    from its paper to its hole. The tag swings around the hole, so the trim fits at every
    angle."""
    deco = layers(root)["Decoration · shared"]
    groups = {n: f[0] for n, f in deco_groups(deco).items()}
    tag_group = next(el for el in groups[TAG_SWINGS].iter() if local(el.tag) == "g" and label(el) == "tag")
    paper = next(el for el in tag_group.iter() if local(el.tag) != "g" and label(el) == "tag")
    pm = global_matrix(root, paper)
    cx, cy = hole_in(root)

    xs, ys = zip(*(apply(pm, x, y) for x, y in subpaths(paper.get("d"))[0]))
    nx, ny = cx - (min(xs) + max(xs)) / 2, cy - (min(ys) + max(ys)) / 2
    n = math.hypot(nx, ny)
    nx, ny = nx / n, ny / n
    px, py, L = -ny, nx, 200
    pts = [
        (cx + px * L, cy + py * L),
        (cx + px * L + nx * L, cy + py * L + ny * L),
        (cx - px * L + nx * L, cy - py * L + ny * L),
        (cx - px * L, cy - py * L),
    ]
    defs = next(root.iter(f"{{{SVG}}}defs"))

    # A clipped group would cut a blended shadow off from what it shades, so each part is
    # wrapped in a group of its own that trims; the trim is drawn in that group's coordinates.
    for k, grp in enumerate((groups[ENV_SHADOWS], groups[ON_ENV])):
        to_local = inverse(global_matrix(root, grp))
        cid = f"e-string-end-{k}"
        clip = ET.SubElement(defs, f"{{{SVG}}}clipPath", {"id": cid, "clipPathUnits": "userSpaceOnUse"})
        ET.SubElement(clip, f"{{{SVG}}}polygon", {
            "points": " ".join(f"{x:.4f},{y:.4f}" for x, y in pts),
            "transform": as_matrix(to_local),
        })
        ET.SubElement(clip, f"{{{SVG}}}path", {
            "d": paper.get("d") + " M -5000,-5000 H 5000 V 5000 H -5000 Z",
            "transform": as_matrix(mul(to_local, pm)),
            "clip-rule": "evenodd",
        })
        for i, c in enumerate(list(grp)):
            wrap = ET.Element(f"{{{SVG}}}g", {"clip-path": f"url(#{cid})"})
            grp.remove(c)
            wrap.append(c)
            grp.insert(i, wrap)


def tag_text(root):
    """A place for the tag's handwritten text, filled and placed by the page: in the tag's
    own coordinates (the paper's transform), over its paper and darkening and under its
    highlights, so the highlight falls over the ink. The page finds the tag's direction
    from the paper and the hole, marked here."""
    tag_group = next(el for el in root.iter() if local(el.tag) == "g" and label(el) == "tag")
    kids = list(tag_group)
    # The paper may sit in a group of its own inside the tag.
    paper, pm = next(
        (el, m) for el, m in find(tag_group, lambda c: local(c.tag) != "g" and label(c) == "tag")
    )
    paper.set("class", "tag-paper")
    for el in tag_group.iter():
        if label(el) == "hole shadow":
            el.set("class", "tag-hole")
    # Over every child that holds the paper or a darkening, under any highlight after them.
    under = [
        i
        for i, c in enumerate(kids)
        if any(label(x) in ("tag", "darken") and local(x.tag) != "g" for x in c.iter())
    ]
    text = ET.Element(f"{{{SVG}}}text", {"class": "tag-text"})
    if pm != (1, 0, 0, 1, 0, 0):
        text.set("transform", "matrix(" + ",".join(f"{v:.8g}" for v in pm) + ")")
    tag_group.insert(max(under) + 1, text)


def seal_tag_edge(root):
    """The tag's edge cut once, after everything on it is drawn. Its darkening is a light
    colour multiplied onto the paper: on an edge pixel the paper only half covers, half of
    that light colour shows as it is, a pale rim along the darkened sides. So the tag sits on
    a copy of its paper spread a little past the edge, and the whole tag is clipped to the
    paper's shape: every pixel under the darkening has paper below it."""
    tag_group = next(el for el in root.iter() if local(el.tag) == "g" and label(el) == "tag")
    paper, pm = next(
        (el, m) for el, m in find(tag_group, lambda c: local(c.tag) != "g" and label(c) == "tag")
    )
    at = "matrix(" + ",".join(f"{v:.8g}" for v in pm) + ")"
    clip = ET.SubElement(next(root.iter(f"{{{SVG}}}defs")), f"{{{SVG}}}clipPath")
    clip.set("id", "e-tag-edge")
    clip.set("clipPathUnits", "userSpaceOnUse")
    ET.SubElement(clip, f"{{{SVG}}}path", {"d": paper.get("d"), "transform": at})
    under = ET.Element(
        f"{{{SVG}}}path",
        {"d": paper.get("d"), "transform": at, "style": "fill:var(--tag);stroke:var(--tag);stroke-width:0.4"},
    )
    wrap = ET.Element(f"{{{SVG}}}g", {"clip-path": "url(#e-tag-edge)"})
    wrap.append(under)
    for c in list(tag_group):
        tag_group.remove(c)
        wrap.append(c)
    tag_group.append(wrap)


MARKUP = [
    "defs", "castOpen", "castClosed", "inside", "insideShade", "flapBack", "flapFront",
    "pocket", "tagShade", "tagHard", "tag", "decoShade", "deco",
]


def drawing_parts():
    """The drawing as markup, layer by layer, and its geometry: what both builds draw."""
    if check():
        raise SystemExit("Fix the problems above before building.")
    root = load()
    drop_dead_fills(root)
    drop_dead_stops(root)
    lift_blends(root)
    trim_strings(root)
    tag_text(root)
    seal_tag_edge(root)
    L = layers(root)
    vb = [float(v) for v in root.get("viewBox").split()]
    # Inkscape's own definitions (path effects) draw nothing; the fold's two clips are
    # written below from FOLD, so the drawing's copies of them are left out.
    defs = "".join(
        ser(c)
        for d in root.iter(f"{{{SVG}}}defs")
        for c in d
        if c.tag.startswith(f"{{{SVG}}}") and c.get("id") not in ("e-above", "e-below")
    )

    back_el = by_label(L["Back · open"], "inside + open flap")
    back = ser(back_el)
    inside, inside_shade = split_inside_shadow(back_el)
    # The flap's back reaches 0.25 past the fold so the two halves meet without a seam.
    defs += (
        f'<clipPath id="e-below" clipPathUnits="userSpaceOnUse"><rect x="{vb[0] - 50}" y="{FOLD}" width="{vb[2] + 100}" height="{vb[3]}"/></clipPath>'
        f'<clipPath id="e-above" clipPathUnits="userSpaceOnUse"><rect x="{vb[0] - 50}" y="{vb[1] - 50}" width="{vb[2] + 100}" height="{FOLD - vb[1] + 50.25}"/></clipPath>'
    )

    def state_class(name):
        return "v-open" if name.endswith("· open") else "v-closed" if name.endswith("· closed") else None

    # Each top-level part of a state layer fades on its own: a wrapping group fading
    # would cut the parts' blends off from the paper below.
    pocket = "".join(ser(c, cls=state_class(n)) for n in POCKET for c in L[n])
    flap = L["Flap · closed"]
    front = by_label(flap, "closed flap")
    pocket += "".join(ser(c, cls="v-closed flap-shadow") for c in flap if c is not front)
    deco = split_decoration(L["Decoration · shared"])

    return {
        "vb": vb,
        "hole": hole(root),
        "defs": defs,
        "castOpen": ser(by_label(L["Back · open"], "cast shadow"), cls="v-open"),
        "castClosed": ser(by_label(L["Back · closed"], "cast shadow"), cls="v-closed"),
        "inside": f'<g clip-path="url(#e-below)">{inside}</g>',
        "insideShade": f'<g clip-path="url(#e-below)">{inside_shade}</g>',
        "flapBack": f'<g clip-path="url(#e-above)">{back}</g>',
        "flapFront": ser(front),
        "pocket": pocket,
        **deco,
    }


APP_OUT = ROOT / "src/components/envelope/drawing.generated.ts"

# The page's own class names, as the app's envelope CSS knows them.
APP_CLASSES = {
    "v-open": "env-v-open",
    "v-closed": "env-v-closed",
    "flap-shadow": "env-flap-shadow",
    "tag-paper": "env-tag-paper",
    "tag-hole": "env-tag-hole",
    "tag-text": "env-tag-text",
}


def for_app(markup):
    """Markup as the app draws it: every id, class and colour under env-, so nothing on
    the invitation's page reaches into the drawing, and the drawing's ids never clash."""
    markup = re.sub(r'(?<=\s)id="([^"]+)"', r'id="env-\1"', markup)
    markup = re.sub(r"url\(#([^)]+)\)", r"url(#env-\1)", markup)
    markup = re.sub(r'href="#([^"]+)"', r'href="#env-\1"', markup)
    markup = re.sub(
        r'class="([^"]+)"',
        lambda m: 'class="' + " ".join(APP_CLASSES.get(c, c) for c in m.group(1).split()) + '"',
        markup,
    )
    return re.sub(
        r"var\(--(paper|liner|string|tag|seal|cast)(-mul|-scr)?\)", r"var(--env-\1\2)", markup
    )


def unique_ids(parts):
    """The inside and the flap's back face are both drawn from the same back group, so
    the same ids come twice. Each later copy of an id takes a suffix, with the references
    inside that same part, so every id on the page is defined once."""
    taken = set()
    for k in MARKUP:
        markup = parts[k]
        ids = re.findall(r'(?<=\s)id="([^"]+)"', markup)
        again = {i for i in ids if i in taken}
        taken.update(ids)
        for i in again:
            markup = markup.replace(f'id="{i}"', f'id="{i}-{k}"')
            markup = markup.replace(f"url(#{i})", f"url(#{i}-{k})")
            markup = markup.replace(f'href="#{i}"', f'href="#{i}-{k}"')
        parts[k] = markup
    return parts


def build_app():
    d = drawing_parts()
    vb = d["vb"]
    drawing = {
        "viewBox": " ".join(f"{v:g}" for v in vb),
        "vb": {"x": vb[0], "y": vb[1], "w": vb[2], "h": vb[3]},
        "fold": FOLD,
        "body": BODY,
        "hole": d["hole"],
        **unique_ids({k: for_app(d[k]) for k in MARKUP}),
    }
    drawing["defs"] = f"<defs>{drawing['defs']}</defs>"
    APP_OUT.parent.mkdir(parents=True, exist_ok=True)
    APP_OUT.write_text(
        "// Generated by .claude/skills/envelope/envelope.py build-app from\n"
        "// .claude/skills/envelope/drawing/envelope-edit.svg. Do not edit: change the drawing and rebuild.\n"
        f"export const DRAWING = {json.dumps(drawing, indent=2, ensure_ascii=False)} as const;\n"
    )
    subprocess.run(["npx", "prettier", "--write", str(APP_OUT)], cwd=ROOT, check=True)
    print(f"Built {APP_OUT.relative_to(ROOT)} ({APP_OUT.stat().st_size // 1024} KB).")
    return 0


def mark_built():
    shutil.copyfile(EDIT, BUILT)
    print(f"Recorded {BUILT.name}: the next diff compares against this.")
    return 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "check":
        sys.exit(check())
    if cmd == "diff":
        sys.exit(diff())
    if cmd == "build-app":
        sys.exit(build_app())
    if cmd == "mark-built":
        sys.exit(mark_built())
    print(__doc__)
    sys.exit(2)
