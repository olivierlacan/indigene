### Fixed

- The French names Indigene shows are checked against France's national
  reference list again. Its website had started turning scripts away, so the
  check now reads the same list from GBIF, where the Muséum publishes it.
- Seven French names now read as the reference list writes them: *Thym
  serpolet*, *Genévrier oxycèdre*, *Doradille cétérac*, *Seslérie bleue*,
  *Argus frêle*, *Grosbec casse-noyaux* and *Vanesse des perlières*.
- Internal: `check-vernacular.mjs` reads TAXREF through GBIF's checklist copy,
  accepts any name the list gives, stops asking an authority after twelve
  failures running, and never lets a `--name` run overwrite the snapshot.
- Internal: 45 `pending` French names are retagged to the list that confirms
  them and 7 unbacked rows to `pending`; `fr.json` is the first committed
  snapshot in which TAXREF answers.
