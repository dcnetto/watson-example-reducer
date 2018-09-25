# watson-example-reducer

## Thou shalt not steal

While this should work with any NLP system out there, it has been tested only against IBM Watson Assistant. 

## DONE
* Nada

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
