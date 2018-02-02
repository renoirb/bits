
.DEFAULT_GOAL: dist
dist: $(wildcard src/**/*) .bit/ test
	bit build

.PHONY: test
test: $(wildcard src/**/*) .bit/
	yarn run lint
	./scripts/test.sh

node_modules:
	yarn

.bit: node_modules/
	bit install
	bit import --force

