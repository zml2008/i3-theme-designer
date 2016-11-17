PHONY: run deploy

build: src/*
	-rm -r build/
	cp -R src/ build/

run: build
	cd build
	python -m http.server

TARGET_BRANCH=gh-pages
REPO = $(shell git config remote.origin.url)
SSH_REPO = $(REPO:https://github.com/%=git@github.com:%)
SHA = $(shell git rev-parse --verify HEAD)

.ONESHELL:
deploy: build
	if [ ! -e "out" ]; then
		git clone $(REPO) out
	fi
	cd out
	git checkout $(TARGET_BRANCH) || git checkout --orphan $(TARGET_BRANCH)
	rm -rf **/* || exit 0
	cp -R ../build/* .
	rm -rf **/.git
	
	git add .
	git commit -m "Deploy to GitHub Pages: ${SHA}"
	git push $(SSH_REPO) $(TARGET_BRANCH)
