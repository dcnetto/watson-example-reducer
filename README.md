![Repo Size](https://img.shields.io/github/repo-size/dcnetto/watson-example-reducer.svg)
![Last Commit](https://img.shields.io/github/last-commit/dcnetto/watson-example-reducer.svg)
![License GPL](https://img.shields.io/aur/license/yaourt.svg)

# Watson Example Reducer

## Thou shalt not steal

While this should work with any NLP system out there, it has been tested only against IBM Watson Assistant.

## DONE
* None

## DOING
* None

## BACKLOG
* Core Features
    * Find and cluster similar examples by their Levenshtein distances
    * Replace the original examples by one example of each cluster found
    * Test the remaining examples against the new "reduced" intent
    * Able to run as a IBM Cloud Function

* Proposed Features
    * The maximum cluster distance should be parameterizable
    * The maximum confidence should be parameterizable (do not add the example if higher)

* Ideas for the future
    * Is there a way to find the better cluster representant?
    * Add support for Damerau-Levenshtein distance
    * Is it possible to add a "Deploy to IBM Cloud Button"?

## KNOWN BUGS
* None (so far)

# Results

## Option 1

1. Sort all examples alphabetically
2. Loop through the list checking every example against Watson
3. If classified incorrectly or with a low confidence score (<=80%), add the example to the intent
4. By definition, all not trained examples will be classified correctly with a confidence score >80%
5. After the first iteration, recheck all not trained examples
