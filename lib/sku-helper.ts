export interface Sku {
  skuID: string;
  stock: number;
  propId_valueId: string;
  [key: string]: any; // For other possible SKU properties
}

export interface ProductInfo {
  skuList: Sku[];
  skuPropMap: Record<string, string>; // Mapping from property ID to property name
  skuPropValueMap: Record<string, string>; // Mapping from property value ID to property value name
  [key: string]: any; // For other properties in productInfo
}

export type SkuPathDict = Record<string, string[]>; // Mapping from combination path to SKU ID array

/**
 * Generate all possible property combinations
 * @param propNames Array of property names
 * @param propertyMap Mapping from property names to property values
 * @returns Array of all possible property combination strings
 */
export function getAllCombinations(
  propNames: string[],
  propertyMap: Record<string, string>,
): string[] {
  const combinations: string[] = [];
  const n = propNames.length;
  const total = 1 << n; // 2^n possibilities

  for (let mask = 1; mask < total; mask++) {
    const current: string[] = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        current.push(propertyMap[propNames[i]]);
      }
    }
    combinations.push(current.join("-"));
  }

  return combinations;
}

/**
 * Generate dynamic SKU path dictionary
 * @param productInfo Product information object
 * @returns SKU path dictionary where keys are property combination strings and values are arrays of SKU IDs
 */
export function generateDynamicSkuPathDict(
  productInfo: ProductInfo,
): SkuPathDict {
  const dict: SkuPathDict = {};
  const { skuList, skuPropMap, skuPropValueMap } = productInfo;

  skuList.forEach((sku) => {
    if (sku.stock <= 0) return;

    // Parse all properties
    const props = sku.propId_valueId.split(";");
    const propertyMap: Record<string, string> = {};

    // Extract property names and values
    props.forEach((prop) => {
      const parts = prop.split(":");

      if (parts.length !== 2) return; // Skip incorrect format

      const [propName, propValue] = parts;

      // Ensure property name and value exist in the maps
      if (skuPropMap[propName] && skuPropValueMap[propValue]) {
        // propertyMap["k" + propName] = propValue;
        propertyMap["k" + propName] = prop;
      }
    });

    // Get all property names
    const propNames = Object.keys(propertyMap);

    // Generate all possible combinations
    const allCombinations = getAllCombinations(propNames, propertyMap);

    // Add SKU ID to all related combinations
    allCombinations.forEach((combination) => {
      if (!dict[combination]) {
        dict[combination] = [];
      }
      dict[combination].push(sku?.skuID);
    });
  });

  return dict;
}
