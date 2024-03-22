$(document).ready(function() {
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Iterate through each story in the response
            $.each(data, function(index, story) {
                // Create HTML elements to display the story data
                var storyHtml = '<div class="story">';
                storyHtml += '<h2>' + story.title + '</h2>';
                storyHtml += '<p>' + story.content + '</p>';
                storyHtml += '</div>';

                // Append the story HTML to the correct container element on the page
                $('#dataContainer').append(storyHtml); // Updated to #dataContainer
            });
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    });
});
