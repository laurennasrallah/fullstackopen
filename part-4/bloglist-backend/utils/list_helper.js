const lodash = require('lodash')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favourite, blog) =>
    blog.likes > favourite.likes ? blog : favourite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  // const authorBlogs = lodash.groupBy(blogs, 'author') // returning author blogs

  // //const sorted = _.sortBy(blogs, 'likes')
  // const iteratees = (obj) => obj.author
  // const sorted = _.sortBy(blogs, iteratees)

  // // grouping the authors and counting their blogs
  // console.log('blogs', blogs)

  const authorCounts = blogs.reduce((authorBlogCounts, blog) => {
    // authorBlogCounts is the accumulator
    if (authorBlogCounts[blog.author]) { // if author already has a counted blog then add to it
      authorBlogCounts[blog.author] += 1
    } else {
      authorBlogCounts[blog.author] = 1 // otherwise count the author with with a starting number of 1 blogs
    }
    return authorBlogCounts
  }, {})

  console.log('authorCounts', authorCounts)

  let mostBlogs = 0
  let topAuthor = null

  for (const author in authorCounts) {
    console.log('current author', author)
    const blogsByAuthor = authorCounts[author]

    if (blogsByAuthor > mostBlogs) {
      mostBlogs = blogsByAuthor
      topAuthor = author
    }
    console.log('author', topAuthor, 'number of blogs', mostBlogs)
  }

  return {
    author: topAuthor,
    blogs: mostBlogs,
  }

}



const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const likesByAuthor = lodash.groupBy(blogs, 'author')
  console.log('likesByAuthor', likesByAuthor)
  const authorLikeCounts = Object.entries(likesByAuthor) // Object.entries convers the object likesByAuthor into an array of [key, values] pairs
  // input example for Object.entries:
  /*{
  "Edsger W. Dijkstra": [ {likes: 5, ...}, {likes: 12, ...} ],
  "Robert C. Martin": [ {likes: 10, ...}, {likes: 0, ...} ]
} */

/* 
output example:
[
  [ "Edsger W. Dijkstra", [ {likes: 5, ...}, {likes: 12, ...} ] ], - The first entry
  [ "Robert C. Martin", [ {likes: 10, ...}, {likes: 0, ...} ] ]    - The second entry
]
 */
  const maxLikeEntry = lodash.maxBy(authorLikeCounts, ([, blogs]) => // the , in [, blogs] is saying to skip the first element in the array (the authors name). blogs assigns the second element (the array of blog objects for that author) to a variable named blogs
    blogs.reduce((sum, blog) => sum + blog.likes, 0) // this takes the array of blog objects and uses reduce to itrate through that array, adding the likes property of each blog to the running sum
  )

  if (!maxLikeEntry) {
    return null
  }

  const totalLikesCount = maxLikeEntry[1].reduce( // maxLikeEntry[1] is acces the second element which is the array of blog objects (the first element is the authors name)
    (sum, blog) => sum + blog.likes,   // we run the stardard summing operation on just the array of blogs, which adds the likes property of each blog to the running sum
    0
  )
   /*
   The extra reduce is needed because the .maxBy() iterator only compared the totals (to find the author), 
   it did not save the total sum. The second reduce calculates and saves the final number(e.g 17)
   into the totalLikesCount variable
   */ 

  return {
    author: maxLikeEntry[0], // this takes the author's name from the firsy position (index 0) of the maxLikeEntry array 
    likes: totalLikesCount, // this is the final calculated sun of likes from the previous step
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
