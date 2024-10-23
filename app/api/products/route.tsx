import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/index";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  orders: number;
  refunds: number;
}

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const pquery = url.searchParams;

  let limit = parseInt(pquery.get("limit") || "10");
  let page = parseInt(pquery.get("page") || "1");
  let search = pquery.get("search") || "";
  let min = parseInt(pquery.get("min") || "0");
  let max = parseInt(pquery.get("max") || "1000000");
  let category = pquery.get("category") || "";
  let sort = pquery.get("sort") === "1" ? "ASC" : "DESC";
  let id = pquery.get("id") || "";

  try {
    let whereClauses: string[] = [];
    let values: any[] = [];
    let paramIndex = 1;
    if (id) {
      const productQuery = "SELECT * FROM products WHERE id = $1";
      const productResult = await query(productQuery, [id]);
      if (productResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(productResult.rows[0]);
    }
    if (search) {
      whereClauses.push(
        `(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }
    if (!isNaN(min) && min >= 0) {
      whereClauses.push(`price >= $${paramIndex}`);
      values.push(min);
      paramIndex++;
    }
    if (!isNaN(max) && max >= 0 && max > min) {
      whereClauses.push(`price <= $${paramIndex}`);
      values.push(max);
      paramIndex++;
    }
    if (category) {
      whereClauses.push(`category ILIKE $${paramIndex}`);
      values.push(`%${category}%`);
      paramIndex++;
    }
    const offset = (page - 1) * limit;
    const whereClause = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";
    const queryText = `
		SELECT id, title, description, price, images, quantity, category, created_at, updated_at, orders, refunds, rate 
		FROM products 
		${whereClause} 
		ORDER BY price ${sort} 
		LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
	  `;
    values.push(limit, offset);
    const products = await query<Product>(queryText, values);
    return NextResponse.json(products.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
