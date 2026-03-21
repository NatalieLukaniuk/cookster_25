- all-recipies component - add comments block to every recipy; got to top btn and functionality
- short-recipy-view component: logic to display user meals preferences chips;   onAddRecipyToCalendar, goFullRecipy methods; view for desktop
- full recipy page
-!!  FILTERS: implement sorting by last prepared - this property should be added on recipy load as computed signal taken from current user and allrecipies -> probably after noshowIds are filtered out; filter by collection; filter by dish type, filter by ingredients
- when all recipies are received from BE, map them to add addLastPrepared property - this probably needs to be done in the recipiesService

improvements:
search for [REWORK] tag

bugs:
- all-recipies page - sometimes images don't load - try reload or display smth instead of the broken img

important 
- all logic to update user belongs to UserService