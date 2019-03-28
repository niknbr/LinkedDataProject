# Know My Beer

An Angular 6 sample application based on PunkAPI.

The applciation can be accessed at : https://nikz99.github.io/KnowMyBeer/

#### Highlights
1. Standard angular applciation architecture based on core, feature and shared modules.
2. Interceptor based caching mechanism to cache specific requests for 30 mins.

#### Assumptions made
1. Non alcoholic beer has ANV less than 1
2. Description search is based on *food* parameter of PunkAPI.

#### Additional Libraries Used
1. [Spectre CSS](https://picturepan2.github.io/spectre/)


#### Future Improvements
1. Custom decorator to update the no cache header to api requests
2. At present, search based on description is done on *food* parameter of PunkAPI. RXJS forkJoin could be used to combine multiple API calls (with caching) for improved results.
3. Infinite scroll for search results. Lazy load results based on scroll position.
4. Local storage based caching mechanism.
5. CSS Improvements
6. Test case improvements.
