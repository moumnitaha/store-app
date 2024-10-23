import { NextApiRequest, NextApiResponse } from "next";

export interface ProductQueryParams {
  limit?: string;
  search?: string;
  min?: string;
  max?: string;
  category?: string;
  page?: string;
  sort?: string;
  id?: string;
}

export const validateProductQuery = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  const { min, max, page, limit, sort, search, category } =
    req.query as ProductQueryParams;

  if (min || max) {
    if (
      parseInt(min!) < 0 ||
      parseInt(max!) < 0 ||
      parseInt(min!) > parseInt(max!) ||
      (min && isNaN(Number(min))) ||
      (max && isNaN(Number(max)))
    ) {
      return res.status(400).json({
        error:
          "Invalid price range, min should be less than max, and both should be positive numbers",
      });
    }
  }

  if (page && (Number(page) < 1 || isNaN(Number(page)))) {
    return res.status(400).json({
      error: "Invalid page number, should be a positive number",
    });
  }

  if (limit && (Number(limit) < 1 || isNaN(Number(limit)))) {
    return res.status(400).json({
      error: "Invalid limit number, should be a positive number",
    });
  }

  if (sort && parseInt(sort) !== 1 && parseInt(sort) !== -1) {
    return res.status(400).json({
      error: "Invalid sort value, should be 1 or -1",
    });
  }

  // Sanitize search and category inputs
  if (search || category) {
    const invalidCharsPattern = /[$\\\[\]{}|;:'"<>`]/;
    if (
      (search && invalidCharsPattern.test(search as string)) ||
      (category && invalidCharsPattern.test(category as string))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid search or category query" });
    }
  }

  await next();
};
