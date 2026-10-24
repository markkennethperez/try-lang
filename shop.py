"""Python version of TrendWear's shop logic.

This module translates shop.js product filtering, searching, sorting, wishlist,
size selection, quick-view data, and cart actions into Python functions.
It does not control the HTML page directly; browsers cannot run Python files
as a replacement for JavaScript event handlers.
"""

from copy import deepcopy

CATEGORIES = ["All", "T-shirts", "Oversized", "Polo", "Hoodies", "Pants/Jeans", "Shorts", "♥ Wishlist"]
PRODUCTS = [
    {"id": 1, "name": 'Everyday Basic Tee', "cat": 'T-shirts', "type": 'tee', "price": 149, "color": '#ffffff', "bg": '#ffd9c7', "colors": ['White', 'Black', 'Gray'], "tag": 'Best seller', "desc": 'Soft cotton-blend tee for everyday school wear. Simple, clean, goes with everything.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 2, "name": 'Campus Graphic Tee', "cat": 'T-shirts', "type": 'tee', "price": 199, "color": '#ff5a1f', "bg": '#ffe8a3', "colors": ['Orange', 'Navy', 'Cream'], "tag": None, "desc": 'Bold front print for a standout campus look. Breathable and comfortable.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 3, "name": 'Pocket Tee', "cat": 'T-shirts', "type": 'tee', "price": 179, "color": '#2f5d50', "bg": '#d4ecd9', "colors": ['Forest', 'Sand', 'Black'], "tag": None, "desc": 'Minimal chest pocket tee. Smart-casual enough for presentation days.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 4, "name": 'Oversized Drop Tee', "cat": 'Oversized', "type": 'oversized', "price": 229, "color": '#1c1c1c', "bg": '#dcd6ff', "colors": ['Black', 'Ash', 'Brown'], "tag": 'Trending', "desc": 'Dropped shoulders and a relaxed fit. The streetwear staple.', "sizes": ['M', 'L', 'XL']},
    {"id": 5, "name": 'Boxy Oversized Tee', "cat": 'Oversized', "type": 'oversized', "price": 249, "color": '#e9e2cf', "bg": '#cfe6ff', "colors": ['Cream', 'Sage', 'Charcoal'], "tag": None, "desc": 'Heavier fabric, boxy cut, easy to style with jeans or shorts.', "sizes": ['M', 'L', 'XL']},
    {"id": 6, "name": 'Classic Polo', "cat": 'Polo', "type": 'polo', "price": 249, "color": '#1f3a8a', "bg": '#ffe0e6', "colors": ['Navy', 'White', 'Maroon'], "tag": None, "desc": 'Neat and comfortable polo for school events and casual outings.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 7, "name": 'Stripe Polo', "cat": 'Polo', "type": 'polo', "price": 279, "color": '#c9462c', "bg": '#e3f3d1', "colors": ['Red', 'Teal', 'Gray'], "tag": None, "desc": 'A fresh stripe twist on the classic polo. Light and breathable.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 8, "name": 'Cozy Pullover Hoodie', "cat": 'Hoodies', "type": 'hoodie', "price": 399, "color": '#6b6f78', "bg": '#ffd9c7', "colors": ['Gray', 'Black', 'Maroon'], "tag": 'Best seller', "desc": 'Warm, soft fleece interior. Perfect for air-conditioned classrooms.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 9, "name": 'Zip-Up Hoodie', "cat": 'Hoodies', "type": 'hoodie', "price": 399, "color": '#243b53', "bg": '#ffe8a3', "colors": ['Navy', 'Black', 'Olive'], "tag": None, "desc": 'Easy on and off with a full zipper and roomy front pockets.', "sizes": ['S', 'M', 'L', 'XL']},
    {"id": 10, "name": 'Straight-Cut Jeans', "cat": 'Pants/Jeans', "type": 'pants', "price": 399, "color": '#3b5b8c', "bg": '#dcd6ff', "colors": ['Blue', 'Black', 'Light wash'], "tag": None, "desc": 'Classic straight fit with a bit of stretch for all-day comfort.', "sizes": ['28', '30', '32', '34']},
    {"id": 11, "name": 'Utility Cargo Pants', "cat": 'Pants/Jeans', "type": 'pants', "price": 349, "color": '#6b705c', "bg": '#d4ecd9', "colors": ['Olive', 'Khaki', 'Black'], "tag": 'Trending', "desc": 'Roomy pockets and a relaxed leg. Practical and very on-trend.', "sizes": ['28', '30', '32', '34']},
    {"id": 12, "name": 'Relaxed Denim Jeans', "cat": 'Pants/Jeans', "type": 'pants', "price": 379, "color": '#8fb0d6', "bg": '#ffe0e6', "colors": ['Light blue', 'Dark blue'], "tag": None, "desc": 'Loose, easygoing denim that pairs with oversized tees.', "sizes": ['28', '30', '32', '34']},
    {"id": 13, "name": 'Casual Everyday Shorts', "cat": 'Shorts', "type": 'shorts', "price": 199, "color": '#b08968', "bg": '#cfe6ff', "colors": ['Tan', 'Black', 'Gray'], "tag": None, "desc": 'Lightweight shorts for hot Cebu days, on or off campus.', "sizes": ['28', '30', '32', '34']},
    {"id": 14, "name": 'Jogger Shorts', "cat": 'Shorts', "type": 'shorts', "price": 179, "color": '#2b2b2b', "bg": '#e3f3d1', "colors": ['Black', 'Gray', 'Navy'], "tag": None, "desc": 'Stretchy waistband, soft fabric, made for lounging or sports.', "sizes": ['S', 'M', 'L', 'XL']},
]

class Shop:
    """Keeps the current shop filters, wishlist, selected sizes, and cart."""

    def __init__(self):
        self.category = "All"
        self.query = ""
        self.sort = "featured"
        self.wishlist = []
        self.cart = []
        self.sizes = {p["id"]: ("M" if "M" in p["sizes"] else ("30" if "30" in p["sizes"] else p["sizes"][0])) for p in PRODUCTS}

    def visible_products(self):
        query = self.query.strip().lower()
        result = []
        for product in PRODUCTS:
            in_category = (self.category == "All" or
                (self.category == "♥ Wishlist" and product["id"] in self.wishlist) or
                product["cat"] == self.category)
            searchable = " ".join([product["name"], product["cat"], *product["colors"]]).lower()
            if in_category and (not query or query in searchable):
                result.append(deepcopy(product))

        if self.sort == "low":
            result.sort(key=lambda p: p["price"])
        elif self.sort == "high":
            result.sort(key=lambda p: p["price"], reverse=True)
        elif self.sort == "name":
            result.sort(key=lambda p: p["name"].casefold())
        return result

    def set_category(self, category):
        if category not in CATEGORIES:
            raise ValueError("Unknown category: " + str(category))
        self.category = category
        return self.visible_products()

    def search(self, query):
        self.query = str(query)
        return self.visible_products()

    def set_sort(self, sort):
        if sort not in ("featured", "low", "high", "name"):
            raise ValueError("Sort must be featured, low, high, or name")
        self.sort = sort
        return self.visible_products()

    def select_size(self, product_id, size):
        product = self.get_product(product_id)
        if size not in product["sizes"]:
            raise ValueError("Size is not available for this product")
        self.sizes[product_id] = size
        return size

    def toggle_wishlist(self, product_id):
        self.get_product(product_id)
        if product_id in self.wishlist:
            self.wishlist.remove(product_id)
            return False
        self.wishlist.append(product_id)
        return True

    def quick_view(self, product_id):
        product = deepcopy(self.get_product(product_id))
        product["selected_size"] = self.sizes[product_id]
        return product

    def add_to_cart(self, product_id, size=None):
        product = self.get_product(product_id)
        selected_size = size or self.sizes[product_id]
        if selected_size not in product["sizes"]:
            raise ValueError("Size is not available for this product")
        for item in self.cart:
            if item["id"] == product_id and item["size"] == selected_size:
                item["qty"] += 1
                return item
        item = {"id": product_id, "size": selected_size, "qty": 1}
        self.cart.append(item)
        return item

    @staticmethod
    def get_product(product_id):
        for product in PRODUCTS:
            if product["id"] == product_id:
                return product
        raise ValueError("Product not found")

    def cart_total(self):
        prices = {p["id"]: p["price"] for p in PRODUCTS}
        subtotal = sum(prices[item["id"]] * item["qty"] for item in self.cart)
        discount = subtotal * 0.10 if sum(item["qty"] for item in self.cart) >= 3 else 0
        return {"subtotal": subtotal, "discount": discount, "total": subtotal - discount}


def main():
    """Small command-line demo for testing the Python shop logic."""
    shop = Shop()
    print("TRENDWEAR CLOTHING - SHOP")
    print("Categories:", ", ".join(CATEGORIES))
    category = input("Choose category (press Enter for All): ").strip() or "All"
    if category in CATEGORIES:
        shop.set_category(category)
    shop.search(input("Search products (press Enter to skip): "))
    print("Sort options: featured, low, high, name")
    sort = input("Choose sort (press Enter for featured): ").strip() or "featured"
    if sort in ("featured", "low", "high", "name"):
        shop.set_sort(sort)
    products = shop.visible_products()
    if not products:
        print("No products match your search.")
        return
    for p in products:
        print(f'{p["id"]}. {p["name"]} | {p["cat"]} | ₱{p["price"]}')
    print(f"Showing {len(products)} of {len(PRODUCTS)} products")


if __name__ == "__main__":
    main()
