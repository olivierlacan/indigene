### Changed

- Internal: a pull request's changelog entry is now its own file in
  `changelog.d/`, so two branches never append to the same lines — merging one
  used to leave every other pull request conflicting on CHANGELOG.md, which was
  in all of the last twenty merges. `npm run changelog:fold` folds them in when
  a version is cut; the compiler reads them on every build, so the rules still
  bite in review.
