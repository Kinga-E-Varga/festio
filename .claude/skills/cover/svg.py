"""Builds the app's drawn art from its Inkscape sources.

    python3 -I .claude/skills/cover/svg.py build <name>   # one source
    python3 -I .claude/skills/cover/svg.py build all      # every source

Sources, outside public/ so they're never served (the hidden reference
photo in one is most of its size):
  art/covers/<name>.svg    a cover's own art (Wildflower's corners), built
                           into public/modular/cover/
  art/drawings/<name>.svg  a drawing hosts pick in the Content tab (the Card
                           covers'), built into public/modular/drawings/;
                           each has its file in src/modular/drawings/, and
                           the build prints the lines that file needs. Its
                           page is one of SHAPES (pad the drawing to it in
                           Inkscape): the covers lay out those three only
Each has one path labelled "lines" (the drawing; a file with a single path
needs no label) and optionally one labelled "fill" (its filled-in shape,
painted under the lines; a stroke on it widens it past them). Labels are
Inkscape's (Layers and Objects panel).

Out:
  <name>.svg            the lines
  <name>-fill.svg       the fill, its stroke kept, or SETTINGS' "stroke" in
                        its place (only with a "fill" path)
  <name>-fill-dark.svg  the fill with the dark palettes' stroke (only when
                        SETTINGS gives a "dark_stroke")

Each file keeps the source's viewBox plus MARGIN units of room on every side,
so a stroke is never cut at the edge; the cover's layers reach as far past
their box (MARGIN / width, MARGIN / height), so every layer shares one box.
Coordinates are rounded to hundredths, Inkscape's extras dropped.
"""

import re
import sys
from pathlib import Path

# Each kind of source: its folder, and where its built files go.
KINDS = {
    "covers": (Path("art/covers"), Path("public/modular/cover")),
    "drawings": (Path("art/drawings"), Path("public/modular/drawings")),
}

# The frames a drawing to pick is drawn in, as src/modular/drawing.ts's
# DRAWING_SHAPES: width and height of its page (viewBox), in any unit.
SHAPES = {"tall": (100, 120), "square": (100, 100), "wide": (120, 100)}

# Room round the drawing on every side, in viewBox units.
MARGIN = 5

# Only what a cover changes from the defaults.
SETTINGS = {
    "wildflower": {"stroke": 2, "dark_stroke": 0.75},
}

ARGS = {"m": 2, "l": 2, "c": 6, "s": 4, "h": 1, "v": 1, "z": 0}
TOKEN = re.compile(r"[MLCSHVZmlcshvz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?")


class BuildError(Exception):
    """A source that can't be built as it is; the message says why."""


def path_tag(source: str, label: str) -> str | None:
    """The <path> labelled `label`, or None. A file with one path alone:
    that path is its lines."""
    tags = re.findall(r"<path\b[^>]*>", source)
    for tag in tags:
        if f'inkscape:label="{label}"' in tag:
            return tag
    if label == "lines" and len(tags) == 1:
        return tags[0]
    return None


def fmt(hundredths: int) -> str:
    """A rounded number, as short as it can be written."""
    text = f"{hundredths / 100:.2f}".rstrip("0").rstrip(".")
    if text.startswith("0."):
        text = text[1:]
    elif text.startswith("-0."):
        text = "-" + text[2:]
    return "0" if text in ("", "-0") else text


def numbers(values: list[int]) -> str:
    out = ""
    for value in values:
        text = fmt(value)
        out += text if out == "" or text.startswith("-") else "," + text
    return out


def compact(d: str, scale: float = 1.0, tx: float = 0.0, ty: float = 0.0) -> str:
    """The path in relative commands, rounded to hundredths, scaled by
    `scale` and moved by (tx, ty), as the path's own transform says. Every
    point is rounded from its exact position, so the rounding never
    drifts."""
    tokens = TOKEN.findall(d)
    out, i, cmd = [], 0, None
    cx = cy = 0.0  # exact current point, in the path's own coordinates
    sx = sy = 0.0  # exact subpath start
    px = py = psx = psy = 0  # the same, placed and rounded

    def placed(x: float, y: float) -> tuple[int, int]:
        return round((scale * x + tx) * 100), round((scale * y + ty) * 100)

    while i < len(tokens):
        token = tokens[i]
        if token.isalpha():
            cmd = token
            i += 1
            if token in "zZ":
                cx, cy, px, py = sx, sy, psx, psy
                out.append("z")
                continue
        relative, kind = cmd.islower(), cmd.lower()
        count = ARGS[kind]
        values = [float(v) for v in tokens[i : i + count]]
        i += count
        if kind == "h":
            # A level line, written as a line: only x moves.
            points, kind = [(values[0] + (cx if relative else 0), cy)], "l"
        elif kind == "v":
            points, kind = [(cx, values[0] + (cy if relative else 0))], "l"
        else:
            points = [
                (values[j] + (cx if relative else 0), values[j + 1] + (cy if relative else 0))
                for j in range(0, count, 2)
            ]
        rounded = [placed(x, y) for x, y in points]
        flat = []
        for x, y in rounded:
            flat += [x - px, y - py]
        out.append(kind + numbers(flat))
        cx, cy = points[-1]
        px, py = rounded[-1]
        if kind == "m":
            sx, sy, psx, psy = cx, cy, px, py
            cmd = "l" if relative else "L"
    return "".join(out)


NUMBER = r"\s*([-+.\deE]+)\s*"


def transform(tag: str) -> tuple[float, float, float]:
    """The path's own transform as (scale, x, y): a move Inkscape leaves on
    a moved path, a scale the same both ways, or a matrix of the two. A
    stretch, a skew or a turn stops the build."""
    found = re.search(r'\stransform="([^"]*)"', tag)
    if found is None:
        return 1.0, 0.0, 0.0
    text = found.group(1).strip()
    move = re.fullmatch(rf"translate\({NUMBER}(?:[, ]{NUMBER})?\)", text)
    if move:
        return 1.0, float(move.group(1)), float(move.group(2) or 0)
    scale = re.fullmatch(rf"scale\({NUMBER}\)", text)
    if scale:
        return float(scale.group(1)), 0.0, 0.0
    matrix = re.fullmatch(rf"matrix\({NUMBER}[, ]{NUMBER}[, ]{NUMBER}[, ]{NUMBER}[, ]{NUMBER}[, ]{NUMBER}\)", text)
    if matrix:
        a, b, c, d, e, f = map(float, matrix.groups())
        if abs(b) < 1e-9 and abs(c) < 1e-9 and abs(a - d) < 1e-9:
            return a, e, f
    raise BuildError(f'unsupported transform "{text}" (a stretch, skew or turn): apply it in Inkscape (Object > Transform) first')


def write(out: Path, view_box: str, tag: str, stroke: str | None) -> None:
    # A built file never carries Inkscape's markers: one that does is someone's
    # source saved in the output folder, and writing over it would lose it.
    if out.exists() and re.search(r"inkscape:|sodipodi:", out.read_text()):
        raise BuildError(f"{out} is an Inkscape source, not a built file: move it to its art/ folder first; nothing written over it")
    d = re.search(r'\sd="([^"]*)"', tag).group(1)
    scale, tx, ty = transform(tag)
    attrs = ' fill-rule="evenodd"' if "fill-rule:evenodd" in tag else ""
    if stroke:
        attrs += f' stroke="#000" stroke-width="{stroke}" stroke-linejoin="round"'
    x, y, w, h = map(float, view_box.split())
    box = f"{x - MARGIN:g} {y - MARGIN:g} {w + 2 * MARGIN:.5f} {h + 2 * MARGIN:.5f}"
    out.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}"><path{attrs} d="{compact(d, scale, tx, ty)}"/></svg>\n'
    )
    print(f"  {out}  {out.stat().st_size // 1024} KB")


def build(name: str) -> None:
    found = [(kind, folder / f"{name}.svg", out) for kind, (folder, out) in KINDS.items() if (folder / f"{name}.svg").exists()]
    if not found:
        raise BuildError(f"no source {name}.svg in " + " or ".join(str(folder) for folder, _ in KINDS.values()))
    kind, source_path, out = found[0]
    out.mkdir(parents=True, exist_ok=True)
    source = source_path.read_text()
    view_box = re.search(r'viewBox="([^"]*)"', source).group(1)
    settings = SETTINGS.get(name, {})
    lines = path_tag(source, "lines")
    if lines is None:
        raise BuildError(f'{source_path}: no path labelled "lines"')
    shape = None
    if kind == "drawings":
        _, _, w, h = map(float, view_box.split())
        shape = next((key for key, (sw, sh) in SHAPES.items() if abs(w / h - sw / sh) < 0.01), None)
        if shape is None:
            sizes = ", ".join(f"{key} {sw} x {sh}" for key, (sw, sh) in SHAPES.items())
            raise BuildError(f"{source_path}: its page is {w:g} x {h:g}; a drawing's page is one of {sizes} (or the same proportions): pad it in Inkscape")
    print(f"{name} (viewBox {view_box}, margin {MARGIN})")
    write(out / f"{name}.svg", view_box, lines, None)
    if shape:
        prop = "--drawing"
        print(f'  src/modular/drawings/{name}.ts  shape: "{shape}",  file: "[{prop}:url(/{out.relative_to("public")}/{name}.svg)]"')
    fill = path_tag(source, "fill")
    if fill is None:
        return
    has_stroke = re.search(r"stroke:#[0-9a-fA-F]{6}", fill)
    width = re.search(r"stroke-width:([0-9.]+)", fill)
    # The source's own stroke, scaled with its path.
    stroke = f"{float(width.group(1)) * transform(fill)[0]:g}" if has_stroke and width else None
    if "stroke" in settings:
        stroke = str(settings["stroke"])
    if stroke and float(stroke) > 2 * MARGIN:
        raise BuildError(f"{source_path}: the fill's stroke ({stroke}) is wider than the margin allows ({2 * MARGIN})")
    write(out / f"{name}-fill.svg", view_box, fill, stroke)
    if "dark_stroke" in settings:
        write(out / f"{name}-fill-dark.svg", view_box, fill, str(settings["dark_stroke"]))


def main() -> None:
    if len(sys.argv) != 3 or sys.argv[1] != "build":
        sys.exit(__doc__)
    target = sys.argv[2]
    names = (
        sorted(p.stem for folder, _ in KINDS.values() for p in folder.glob("*.svg") if path_tag(p.read_text(), "lines"))
        if target == "all"
        else [target]
    )
    failed = []
    for name in names:
        try:
            build(name)
        except BuildError as error:
            failed.append(f"{name}: {error}")
    if failed:
        sys.exit("not built:\n  " + "\n  ".join(failed))


if __name__ == "__main__":
    main()
