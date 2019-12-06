.PHONY: all test

all: test

test:
	@npm run test
	@npm run lint
