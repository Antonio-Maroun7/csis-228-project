"use strict";

function getCategoryIcon(categoryName = "") {
  const name = String(categoryName).toLowerCase();

  if (name.includes("hair")) return "💇";
  if (name.includes("skin")) return "🧖";
  if (name.includes("medical")) return "🩺";
  if (name.includes("consult")) return "🩺";
  if (name.includes("physio")) return "🧘";
  if (name.includes("therapy")) return "🧘";
  if (name.includes("salon")) return "✂️";
  if (name.includes("advisor")) return "💬";
  if (name.includes("advisory")) return "💬";

  return "▦";
}

function decorateCategoriesForView(categories = []) {
  return categories
    .filter((category) => category && category.is_active !== false)
    .map((category, index) => {
      const categoryName =
        category.name || category.category_name || "Category";

      return {
        id: category.id || category.category_id,
        name: categoryName,
        description:
          category.description ||
          category.category_description ||
          "Explore available services and book your appointment",
        servicesCount: Number(
          category.servicesCount ||
            category.services_count ||
            category.service_count ||
            0,
        ),
        icon: getCategoryIcon(categoryName),
        featured: index === 1,
      };
    });
}

module.exports = { getCategoryIcon, decorateCategoriesForView };
