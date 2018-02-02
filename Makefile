
.DEFAULT_GOAL: dist
dist: $(wildcard src/**/*) .bit/
	bit build

.PHONY: test
test: $(wildcard src/**/*) .bit/
	./scripts/test.sh

node_modules:
	yarn

.bit: node_modules/
	bit install
	bit import --force

