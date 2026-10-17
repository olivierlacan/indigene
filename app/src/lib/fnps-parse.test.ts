// The FNPS plant-page reader. The fixture copies the page's markup shape — a
// label on one line, its value on the next, section headings in between —
// with only the facts the harvester keeps.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { parseIndex, parsePlant } from "../../scripts/_fnps-parse.mjs";

const page = `
<nav><a href="/plant">FNPS Plant Database</a></nav>
<h2>Nomenclature</h2>
<p><b>Common Name:</b></p><p>American beautyberry</p>
<p><b>Genus species:</b></p><p><i>Callicarpa americana</i></p>
<p><b>Family:</b></p><p>Lamiaceae (Labiatae)</p>
<h2>Plant Specifics</h2>
<p><b>Form:</b></p><p>Shrub</p>
<p><b>Size:</b></p><p>4&ndash;8 ft tall by 3&ndash;6 ft wide</p>
<p><b>Noted For:</b></p><p>Showy Flowers, Showy Fruits</p>
<h2>Landscaping</h2>
<p><b>Considerations:</b></p><p>Their own prose, which is not kept.</p>
<p><b>Availability:</b></p><p>Quality Nurseries, Native Nurseries, FNPS Plant Sales, Seed</p>
<p><b>Light:</b></p><p>Full Sun, Part Sun</p>
<p><b>Moisture Tolerance:</b></p><p>Usually moist, occasional inundation</p><p>-to- </p><p>Somewhat long very dry periods</p>
<p><b>Salt Water Flooding</b></p><p>&#xfeff;</p><p><b>Tolerance:</b></p><p>Not salt tolerant</p>
<p><b>Soil pH:</b></p><p>Adaptable</p>
<p><b>Suitable to Grow In:</b></p><p>8A,8B,9A,9b</p>
<p>USDA zones are based on the average annual extreme minimum winter temperature.</p>
<p><b>Vouchered In:</b></p><script>const FNPS_API_KEY = "x";</script>
`;

describe("parsePlant", () => {
  const p = parsePlant(page);

  it("reads the names", () => {
    expect(p.latin).toBe("Callicarpa americana");
    expect(p.common).toBe("American beautyberry");
  });

  it("stops a value at the next section heading", () => {
    expect(p.family).toBe("Lamiaceae (Labiatae)");
    expect(p.notedFor).toEqual(["Showy Flowers", "Showy Fruits"]);
  });

  it("keeps facts and leaves their prose behind", () => {
    expect(p.availability).toContain("Native Nurseries");
    expect(JSON.stringify(p)).not.toContain("Their own prose");
  });

  it("reads both ends of the moisture range", () => {
    expect(p.moisture).toEqual({
      wettest: "Usually moist, occasional inundation",
      driest: "Somewhat long very dry periods",
    });
  });

  it("rejoins a label split over two lines", () => {
    expect(p.saltFlooding).toBe("Not salt tolerant");
  });

  it("reads zones as upper-case half-zones", () => {
    expect(p.zones).toEqual(["8A", "8B", "9A", "9B"]);
  });

  it("refuses a page that isn't a plant", () => {
    expect(parsePlant("<h1>Page not found</h1>")).toBeNull();
  });
});

describe("parseIndex", () => {
  it("lists each plant once and skips the index's own anchors", () => {
    const html = `<a href="/plant#A">A</a><a href="/plant/acer-rubrum">x</a><a href="/plant/acer-rubrum">y</a><a href="/plant/zamia-integrifolia">z</a>`;
    expect(parseIndex(html)).toEqual(["acer-rubrum", "zamia-integrifolia"]);
  });
});
