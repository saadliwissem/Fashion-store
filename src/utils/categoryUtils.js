// Utility functions for category tree operations
export const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];

  categories
    .filter(
      (category) =>
        String(category.parent) === String(parentId) ||
        (category.parent === null && parentId === null)
    )
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .forEach((category) => {
      const children = buildCategoryTree(categories, category._id);
      const node = {
        ...(category.toObject ? category.toObject() : category),
        children: children.length > 0 ? children : undefined,
      };
      tree.push(node);
    });

  return tree;
};

export const flattenCategories = (
  categories,
  level = 0,
  parentName = "",
  path = []
) => {
  return categories.reduce((acc, category) => {
    const currentPath = [...path, category.name];
    const categoryWithLevel = {
      ...category,
      level,
      parentName,
      path: currentPath.join(" > "),
    };
    acc.push(categoryWithLevel);

    if (category.children && category.children.length > 0) {
      acc.push(
        ...flattenCategories(
          category.children,
          level + 1,
          category.name,
          currentPath
        )
      );
    }

    return acc;
  }, []);
};

export const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category._id === id || category.id === id) {
      return category;
    }
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const getAllParentCategories = (categories, currentId) => {
  const parentIds = new Set();

  const findParents = (cats, targetId) => {
    for (const cat of cats) {
      if (cat._id === targetId || cat.id === targetId) {
        if (cat.parent) {
          parentIds.add(cat.parent);
          findParents(cats, cat.parent);
        }
        break;
      }
      if (cat.children) {
        findParents(cat.children, targetId);
      }
    }
  };

  findParents(categories, currentId);
  return Array.from(parentIds);
};
