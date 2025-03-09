Files in this directory are eagerly loaded first. Needed for test fixtures because
Meteor uses some esoteric file eager loading order: templates, then lib, then
deep paths, then lexicographic, unless basename is main, main is last.
