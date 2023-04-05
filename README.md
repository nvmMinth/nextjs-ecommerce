1.  Set up Next App, Tailwindcss
2.  Layout Component
3.  Products
    # add data.js
    # Create component ProductCart
    # render product cards list in Home
4.  Product Detail pages/product/[slug].js
    # 1st col: image, 2nd col: product info, 3rd col: cart action
    \*Add to Cart:
    # define context Store
    # define cart item states
    # add to cart action
    # add reducer
    # add store provider
    # handle add to cart button
5.  Cart page pages/cart.js
    # useContext to list cart items
    \*Remove from Cart
    # updated product quantity by select tag, limit = countInStock
6.  Save cart items in cookies
    # install js-cookie, save cart items in reducer
    \*Hydration error:
    <!-- difference between the React tree that was pre-rendered (SSR/SSG) and the React tree that rendered during the first render in the Browser (cart items were stored in cookies Client-side) -->
    # use dynamic in cart.js
    # use useEffect in Layout.js for the cartItems count at header
7.  Login Form pages/login.js
    # install react hook form
8.  Connect to MongoDB
    # install mongoose, install mongodb or use mongodb atlas, save connection url in .env file
    # create connect & disconnect in utils/db.js
    # add users arr in data.js
    # create user model in models/user.js
    # create seed.js
9.  Create Login api api/auth/[...nextauth].js
    # install next-auth
    # implement signin
    # use signin in login form
10. User dropdown menu

    # check user authentication

    # install headlessui

    # show dropdown menu

11. Shipping page

    # create shipping page

    # save address in context

12. Payment page
    # create payment page
    # save payment method in context
13. Seed sample products in MongoDB
    # add sample products to Mongodb
    # display products at Home page and Product page
    # check count in stock base on actual count in the Backend
14. Place Order Page
    # display shipping address, order products, payment method
    # implement create order
15. Create Order Page
    # implement backend api for order placed
    # load and display order details from backend
16. Register Page
    # sign up api
    # call api on form submit
17. Pay by Paypal
    # create backend api
    # update order states
18. Order history Page
    # create api and the component
    # fetch and display them
19. Profile update page
    # create profile page
    # show and handle update user information
