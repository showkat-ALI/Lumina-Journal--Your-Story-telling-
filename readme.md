<img src="./resource/brandLogo.webp" alt="Lumina Journal" width="200" height="200">

## Features

### Sorting
```typescript
// filepath/Lumina Journal/src/app/QueryBuilder/queryBuilder.ts
sort() {
  const sort = this?.query?.sortBy as string;
  const sortOrder = this?.query?.sortOrder as SortOrder;
  if (sort) {
    this.modelQuery = this?.modelQuery?.sort([[sort, sortOrder]]);
    return this;
  }
  return this;
}
```

### Searching
```typescript
// filepath/Lumina Journal/src/app/QueryBuilder/queryBuilder.ts
search(searchableField: string[]) {
  const search = this?.query?.search;
  if (search) {
    this.modelQuery = this.modelQuery.find({
      $or: searchableField.map(
        (field) =>
          ({
            [field]: { $regex: search, $options: 'i' },
          }) as FilterQuery<T>,
      ),
    });
  }
  return this;
}
```

### Filtering
```typescript
// filepath/Lumina Journal/src/app/QueryBuilder/queryBuilder.ts
async filter() {
  const queryObject = { ...this.query };
  const excludeFields = [
    'search',
    'sortBy',
    'limit',
    'page',
    'fields',
    'sortOrder',
  ];
  excludeFields.forEach((el) => delete queryObject[el]);

  if (queryObject.filter) {
    const userID = queryObject.filter as string;
    const author = await User.findById(userID).exec();
    if (author) {
      this.modelQuery = this.modelQuery.find({ 'owner.email': author.email });
    }
  }

  return this.modelQuery.exec();
}
