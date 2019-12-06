.PHONY: all test

all: test

test:
	@npm run lint
	@npm run test

