export interface Filters {
    ingredientsToExclude: string[],
    ingredientsToInclude: string[],
    maxPrepTime: number,
    tagsToShow: number[],
    tagsToExclude: number[],
    collectionsToInclude: string[],
    search: string,
    sorting: RecipySorting,
    sortingDirection: RecipySortingDirection
}

export enum RecipySorting {
    Default,
    ByLastPrepared,
    ByTotalPreparationTime,
    ByActivePreparationTime,
}

export enum RecipySortingDirection {
    SmallToBig = 'ascending',
    BigToSmall = 'descending'
}

export const DEFAULT_SORTING = RecipySorting.Default;
export const DEFAULT_SORTING_DIRECTION = RecipySortingDirection.SmallToBig;

 export const clearedFilters: Filters = {
    ingredientsToExclude: [],
    ingredientsToInclude: [],
    maxPrepTime: 0,
    tagsToShow: [],
    tagsToExclude: [],
    collectionsToInclude: [],
    search: '',
    sorting: DEFAULT_SORTING,
    sortingDirection: DEFAULT_SORTING_DIRECTION
  };