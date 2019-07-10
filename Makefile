install: install-deps

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

start:
	npx babel-node -- src/bin/gendiff.js

publish:
	npm publish --dry-run

.PHONY: test
