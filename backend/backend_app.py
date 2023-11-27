from flask import Flask, jsonify, request
from flask_cors import CORS
from operator import itemgetter

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
POSTS_PER_PAGE = 3

POSTS = [
    {"id": 1, "title": "Enchanting Escapade in Kyoto: A Glimpse into Japan's Ancient Beauty", "content":"Experience the magic of Kyoto, where traditional meets modern in perfect harmony. Wander through historic temples, stroll along charming streets adorned with cherry blossoms, and indulge in authentic Japanese cuisine. Kyoto's rich cultural heritage and serene landscapes make it a captivating destination for every traveler seeking a blend of history and tranquility."},
    {"id": 2, "title": "Sunset Serenity: Exploring Santorini's Idyllic Beauty", "content": "Santorini, with its iconic white-washed buildings perched on cliffs overlooking the Aegean Sea, is a dreamlike destination. Immerse yourself in the vibrant hues of a Santorini sunset, explore the narrow cobblestone streets, and savor local delicacies against the backdrop of the azure sea. This Greek island paradise promises an unforgettable escape where every moment is painted in shades of serenity."},
    {"id": 3, "title": "Wild Wonders of Patagonia: A Nature Lover's Expedition", "content": "Embark on an adventure to Patagonia, where nature reigns supreme. Marvel at the towering peaks of the Andes, witness the power of breathtaking glaciers, and encounter diverse wildlife in their natural habitat. Patagonia's untamed landscapes offer a raw and unfiltered experience for those seeking the thrill of exploration amidst some of the world's most awe-inspiring scenery."},
    {"id": 4, "title": "Mystical Marrakech: A Journey Through Morocco's Cultural Heart", "content": "Lose yourself in the vibrant tapestry of Marrakech, where the ancient meets the contemporary. Explore bustling markets, wander through enchanting palaces, and savor the aromatic spices of Moroccan cuisine. The city's vibrant colors, intricate architecture, and warm hospitality create an immersive experience that lingers in the memory long after your journey through Morocco's cultural heart."},
    {"id": 5, "title": "Adrenaline Rush in Queenstown: The Adventure Capital of New Zealand", "content": "Brace yourself for an adrenaline-fueled escapade in Queenstown, nestled on the shores of Lake Wakatipu. Known as the adventure capital of New Zealand, Queenstown offers an array of thrilling activities. From bungee jumping off Kawarau Bridge to exploring the stunning landscapes of Fiordland National Park, every moment in Queenstown is an invitation to push boundaries and savor the rush of the extraordinary."},
    {"id": 6, "title": "Adrenaline Rush in Queenstown: The Adventure Capital of New Zealand", "content": "Brace yourself for an adrenaline-fueled escapade in Queenstown, nestled on the shores of Lake Wakatipu. Known as the adventure capital of New Zealand, Queenstown offers an array of thrilling activities. From bungee jumping off Kawarau Bridge to exploring the stunning landscapes of Fiordland National Park, every moment in Queenstown is an invitation to push boundaries and savor the rush of the extraordinary."},

    ]


@app.route('/api/posts', methods=['GET'])
def get_posts():
    page_param = request.args.get('page', 1, type=int)

    # Implement pagination
    start_idx = (page_param - 1) * POSTS_PER_PAGE
    end_idx = start_idx + POSTS_PER_PAGE
    paginated_posts = POSTS[start_idx:end_idx]


    return jsonify(paginated_posts)


@app.route('/api/posts', methods=['GET', 'POST'])
def add_post():
    if request.method == 'POST':
        # Get json data from the request post
        data = request.get_json()

        if 'title' not in data or 'content' not in data:
            # Return a 400 bad request response  with an error message
            return jsonify({'error': 'Both title and content are required'}), 400

        new_blog_id = len(POSTS) + 1
        new_post = {
            'id': new_blog_id,
            'title': data['title'],
            'content': data['content']
        }

        POSTS.append(new_post)

        # Return a 201  Created response with the new post data
        return jsonify(new_post), 201
    if request.method == 'GET':
        return jsonify(POSTS)


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    global POSTS

    # Find the post with the specified ID
    post_to_delete = next((post for post in POSTS if post['id'] == post_id), None)
    post_index = next((index for index, post in enumerate(POSTS) if post['id'] == post_id), None)

    if post_to_delete:
        # Remove the post from the list
        POSTS.remove(post_to_delete)
        return jsonify({'message': 'Post deleted successfully'})
    else:
        # If post with the specified ID is not found, return a 404 error
        return jsonify({'error': 'Post not found'}), 404


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update(post_id):
    data = request.get_json()

    # Find the post to update
    post_to_update = next((post for post in POSTS if post['id'] == post_id), None)

    # If the post does not exist, return a 404 Not Found  response
    if post_to_update is None:
        return jsonify({'error': 'Post not found'}), 404

    # update the post  with new title and content if provided
    if 'title' in data:
        post_to_update['title'] = data['title']
    if 'content' in data:
        post_to_update['content'] = data['content']

    # Return a 200  Ok  response with the updated post data

    return jsonify(post_to_update), 200


@app.route('/api/posts/search', methods=['GET'])
def search_post():
    try:
        # GEt the search terms from query parameters
        title_query = request.args.get('title', '')
        content_query = request.args.get('content', '')
        # Filter posts based on search terms
        matched_posts = []
        for post in POSTS:
            if title_query.lower() in post['title'].lower() or content_query.lower() in post['content'].lower():
                matched_posts.append(post)

        # Return the matched post in the response
        return jsonify(matched_posts)
    except Exception as e:
        # Handle exception and return error message
        error_message = f'Error during search: {str(e)}'
        return jsonify({"error": error_message}), 500

#
# @app.route('/api/posts', methods=['GET'])
# def list_posts():
#     try:
#         # Get the sort and direction parameters from query parameters
#         sort_param = request.args.get('sort', '')
#         direction_param = request.args.get('direction', '')
#
#         # default values for sort and direction
#         sort_field = 'id'
#         sort_direction = 'asc'
#
#         # Check if the provided sort parameters valid
#         if sort_param.lower() in ['title', 'content']:
#             sort_field = sort_param.lower()
#
#         # check if the provided  direction parameter is valid
#         if direction_param.lower() in ['asc', 'desc']:
#             sort_direction = direction_param.lower()
#
#         # sort the posts based on the provided parameters
#         sorted_posts = sorted(POSTS, key=lambda x: x[sort_field], reverse=(sort_direction == 'desc'))
#         print(sorted_posts)
#
#         return jsonify(sorted_posts)
#
#     except Exception as e:
#         # Handle exceptions and return an error response
#         error_message = f"Error listing posts: {str(e)}"
#         return jsonify({"error": error_message}), 500

@app.route('/api/posts', methods=['GET'])
def list_posts():
    try:
        # Get the sort and direction parameters from query parameters
        sort_param = request.args.get('sort', '')
        direction_param = request.args.get('direction', '')


        # Default values for sort and direction
        sort_field = 'id'
        sort_direction = 'asc'

        # Check if the provided sort parameters are valid
        if sort_param.lower() in ['title', 'content']:
            sort_field = sort_param.lower()

        # Check if the provided direction parameter is valid
        if direction_param.lower() in ['asc', 'desc']:
            sort_direction = direction_param.lower()

        # Print debugging information
        print(f"Sort Field: {sort_field}, Sort Direction: {sort_direction}")

        # Sort the posts based on the provided parameters
        sorted_posts = sorted(POSTS, key=lambda x: x[sort_field], reverse=(sort_direction == 'desc'))

        # Print the sorted posts for debugging
        print("Sorted Posts:", sorted_posts)


        # Return the sorted posts in the response
        return jsonify(sorted_posts)

    except Exception as e:
        # Handle exceptions and return an error response
        error_message = f"Error listing posts: {str(e)}"
        return jsonify({"error": error_message}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
