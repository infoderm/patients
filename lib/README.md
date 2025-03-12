Files in this directory are eagerly loaded first by Meteor.

This is needed for test fixtures because Meteor uses some esoteric file eager
loading order:
  1. templates,
  2. paths containing a `/lib/` fragment,
  3. all paths whose basename is not `main`,
  4. all paths whose basename is `main`.

Within each group, paths are ordered quasi-lexicographically:
  - deeper paths come first,
  - lexicographic order on paths of same depth.

To avoid conflicts, we forbid any other directory in this repository to be
named `lib/`.

See:
  - https://github.com/meteor/meteor/blob/97b721b415e73c072284404e800f9a4d1eb040ea/tools/isobuild/package-source.js#L51-L141
