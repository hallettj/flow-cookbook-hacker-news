# Makefile for transpiling with Babel in a Node app, or in a client- or
# server-side shared library.

.PHONY: all build clean

# Install `babel-cli` in a project to get the transpiler.
babel := node_modules/.bin/babel

# Identify modules to be transpiled by finding files ending in `.js.flow`.
src_files := $(shell find . -name '*.js.flow' -not -path './node_modules/*')

# Build list of expected output files by changing `.js.flow` to `.js` in
# `src_files` list. Generated files are put in the same directory as the source
# file. Because we generate the list in this way, we can selectively remove
# generated files in the `clean` target. Modules that should be excluded from
# transpiling (`.js` files with no corresponding `.js.flow` file) are excluded
# from this list, so they are not overwritten when running `make`, and are not
# removed when running `make clean`.
out_files := $(patsubst %.js.flow,%.js,$(src_files))

# Putting each generated file in the same directory with its corresponding
# source file is important when working with Flow: during type-checking Flow
# will look in npm packages for `.js.flow` files to find type definitions. So
# putting `.js` and `.js.flow` files side-by-side is how you export type
# definitions from a shared library.

# We also want to build a list of `.js.map` output files, so that we can remove
# them in the `clean` target.
map_files := $(patsubst %.js.flow,%.js.map,$(src_files))

all: build

# Ask `make` to build all of the output `.js` files that we want to produce.
# This target also depends on the `node_modules/` directory, so that `make`
# automatically runs `yarn install` if `package.json` has changed.
build: node_modules $(out_files)

# This rule tells `make` how to turn a `.js.flow` file into a `.js` file.
# Transpiling one file at a time makes incremental compilation faster:
# `make` will only transpile source files that have changed since the last
# invocation.
%.js: %.js.flow
	$(babel) $< --out-file $@ --source-maps

# When cleaning, remove files generated by the `build` target, and nothing else.
clean:
	rm -f $(out_files) $(map_files)

# This rule informs `make` that the `node_modules/` directory is out-of-date
# after changes to `package.json`, and instructs `make` on how to install
# modules to get back up-to-date.
node_modules: package.json
	yarn install