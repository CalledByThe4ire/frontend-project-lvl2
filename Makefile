install: install-deps

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

lint:
	npx eslint . --fix

start:
	npx babel-node -- src/bin/gendiff.js /Users/calledbythefire/Documents/Projects/frontend-project-lvl2/__tests__/__fixtures__/yaml/before.yml /Users/calledbythefire/Documents/Projects/frontend-project-lvl2/__tests__/__fixtures__/yaml/after.yml

publish:
	npm publish --dry-run

test:
	npm test

test-watch:
	npm run  test -- --watch

test-coverage:
	npm test -- --coverage

.PHONY: test
