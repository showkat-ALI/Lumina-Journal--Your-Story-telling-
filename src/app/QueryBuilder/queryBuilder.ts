import { FilterQuery, Query, SortOrder } from 'mongoose';
import { User } from '../modules/user/user.model';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
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

    return this;
  }

  async execute() {
    return await this.modelQuery.exec();
  }
  sort() {
    const sort = this?.query?.sortBy as string;
    const sortOrder = this?.query?.sortOrder as SortOrder;
    if (sort) {
      this.modelQuery = this?.modelQuery?.sort([[sort, sortOrder]]);
      return this;
    }
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join('') || '-_v';
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
      return this;
    }
    return this;
  }
}
export default QueryBuilder;
