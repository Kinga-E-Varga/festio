"""Builds a drawn cover's app files from its Inkscape source.

    python3 -I .claude/skills/cover/svg.py build <name>   # one cover
    python3 -I .claude/skills/cover/svg.py build all      # every source

Source: public/modular/svg-elements/<name>.svg, one path labelled "lines" (the
drawing) and optionally one labelled "fill" (its filled-in shape, painted under
the lines; a stroke on it widens it past them). Labels are Inkscape's
(Layers and Objects panel).

Out, in public/modular/cover/:
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

SOURCES = Path("public/modular/svg-elements")
OUT = Path("public/modular/cover")

# Room round the drawing on every side, in viewBox units.
MARGIN = 5

# Only what a cover changes from the defaults.
SETTINGS = {
    "wildflower": {"stroke": 2, "dark_stroke": 0.75},
}

ARGS = {"m": 2, "l": 2, "c": 6, "z": 0}
TOKEN = re.compile(r"[MLCZmlcz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?")


def path_tag(source: str, label: str) -> str | None:
    """The <path> labelled `label`, or None."""
    for tag in re.findall(r"<path\b[^>]*>", source):
        if f'inkscape:label="{label}"' in tag:
            return tag
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


def compact(d: str) -> str:
    """The path in relative commands, rounded to hundredths. Every point is
    rounded from its exact position, so the rounding never drifts."""
    tokens = TOKEN.findall(d)
    out, i, cmd = [], 0, None
    cx = cy = sx = sy = 0.0  # exact current point and subpath start
    px = py = psx = psy = 0  # the same, rounded
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
        points = [
            (values[j] + (cx if relative else 0), values[j + 1] + (cy if relative else 0))
            for j in range(0, count, 2)
        ]
        rounded = [(round(x * 100), round(y * 100)) for x, y in points]
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


def write(out: Path, view_box: str, tag: str, stroke: str | None) -> None:
    d = re.search(r'\sd="([^"]*)"', tag).group(1)
    attrs = ' fill-rule="evenodd"' if "fill-rule:evenodd" in tag else ""
    if stroke:
        attrs += f' stroke="#000" stroke-width="{stroke}" stroke-linejoin="round"'
    x, y, w, h = map(float, view_box.split())
    box = f"{x - MARGIN:g} {y - MARGIN:g} {w + 2 * MARGIN:.5f} {h + 2 * MARGIN:.5f}"
    out.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}"><path{attrs} d="{compact(d)}"/></svg>\n'
    )
    print(f"  {out}  {out.stat().st_size // 1024} KB")


def build(name: str) -> None:
    source_path = SOURCES / f"{name}.svg"
    if not source_path.exists():
        sys.exit(f"no source {source_path}")
    source = source_path.read_text()
    view_box = re.search(r'viewBox="([^"]*)"', source).group(1)
    settings = SETTINGS.get(name, {})
    lines = path_tag(source, "lines")
    if lines is None:
        sys.exit(f'{source_path}: no path labelled "lines"')
    print(f"{name} (viewBox {view_box}, margin {MARGIN})")
    write(OUT / f"{name}.svg", view_box, lines, None)
    fill = path_tag(source, "fill")
    if fill is None:
        return
    has_stroke = re.search(r"stroke:#[0-9a-fA-F]{6}", fill)
    width = re.search(r"stroke-width:([0-9.]+)", fill)
    stroke = width.group(1) if has_stroke and width else None
    if "stroke" in settings:
        stroke = str(settings["stroke"])
    if stroke and float(stroke) > 2 * MARGIN:
        sys.exit(f"{source_path}: the fill's stroke ({stroke}) is wider than the margin allows ({2 * MARGIN})")
    write(OUT / f"{name}-fill.svg", view_box, fill, stroke)
    if "dark_stroke" in settings:
        write(OUT / f"{name}-fill-dark.svg", view_box, fill, str(settings["dark_stroke"]))


def main() -> None:
    if len(sys.argv) != 3 or sys.argv[1] != "build":
        sys.exit(__doc__)
    target = sys.argv[2]
    names = (
        sorted(p.stem for p in SOURCES.glob("*.svg") if path_tag(p.read_text(), "lines"))
        if target == "all"
        else [target]
    )
    for name in names:
        build(name)


if __name__ == "__main__":
    main()
