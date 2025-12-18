# Plugin: Post Picker
Allows users to search for posts and added them to the post content.

## Time Spent
This time includes setting up the plugin with all the moving peices + building the component and cleaning up the code.

```php
echo '5 - 6 hours';
```

## WP Cli Command

**Example usage**
```php
// Get list of containers
docker ps

// Insert the docker container
docker exec -it faa0b3308787 /bin/bash

// WP Cli Command  --date-after?:YYYY-MM-DD --date-before?:YYYY-MM-DD --batch-size?:10 --post-type?:type --block-name?:block/post-picker
wp --allow-root dmg-read-more search --batch-size=10 --post-type=article --date-after=2025-01-01 --date-before=2025-02-04  --block-name=block/post-picker
```

## Screenshot (Block)

- When post is selected, link and color is displayed - prepended by Read more:

![Alt example](/screenshot-block.png?raw=true "Example of block settings")

## Screenshot (Block settings)

- Search input (Uses string & POST IDs)
- Pager (I used this style because space is limited)
- Search Results (Default to the 5 most recent if search input is empty)
- Link style (Allows editor to change the link color if needed)

![Alt example](/screenshot-search.png?raw=true "Example of block search")

## Minimal requirements

-   PHP 8.1
-   WordPress > 6.2.2
-   Node > 18
-   Yarn 3.6.3

## Development setup

To build the plugin

PHP setup

-   `composer install`

JS setup

-   `yarn install`
-   `yarn build` to create the build
-   `yarn start` to start the development watch mode

JS lint

-   `yarn lint:js`
-   `yarn lint:css`
