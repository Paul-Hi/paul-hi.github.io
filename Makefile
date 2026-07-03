SHELL := /usr/bin/env bash

.PHONY: help build serve clean install

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install Ruby dependencies
	bundle install

build: ## Build the site
	bundle exec jekyll build

serve: ## Serve the site locally
	bundle exec jekyll serve --livereload --host 0.0.0.0

clean: ## Clean build directory
	bundle exec jekyll clean
