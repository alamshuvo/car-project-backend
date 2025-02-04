import { FilterQuery, Query } from 'mongoose';

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

class QueryBuilder<T> {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Construct a QueryBuilder instance.
   * @param {Query<T[], T>} modelQuery - The Mongoose query object
   * @param {Record<string, unknown>} query - The query object containing search, filter, sort, and pagination criteria.
   */
  /******  f9424549-b5d1-4440-ab01-204b3c317e52  *******/
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchAbleFields: string[]) {
    if (this?.query?.search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: this.query.search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy
    // Filtering
    const excludeFields = ['search', 'sortOrder', 'sortBy', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Add custom filters for price, brand, category, and stock
    if (queryObj.price) {
      const priceRange = (queryObj.price as string).split('-');
      queryObj.price = {
        $gte: Number(priceRange[0]),
        $lte: Number(priceRange[1]),
      };
    } else {
      delete queryObj['price'];
    }

    if (queryObj.brand !== 'null' && queryObj.brand) {
      queryObj.brand = { $regex: new RegExp(`^${queryObj.brand}$`, 'i') };
    } else {
      delete queryObj['brand'];
    }

    if (queryObj.category !== 'null' && queryObj.category) {
      // Filter category equal to the value (e.g., Sedan)
      queryObj.category = { $regex: new RegExp(`^${queryObj.category}$`, 'i') };
    } else {
      delete queryObj['category'];
    }

    if (queryObj.stock === '>0') {
      queryObj.stock = { $gt: 0 };
    } else {
      delete queryObj['stock'];
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortOrder = this?.query?.sortOrder as string;
    const joinBy = sortOrder === 'desc' ? '-' : '';
    const sort =
      (this?.query?.sort as string)?.split(',').join(` ${joinBy}`) ||
      `${joinBy}createdAt`;

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    } as TMeta;
  }
}

export default QueryBuilder;
