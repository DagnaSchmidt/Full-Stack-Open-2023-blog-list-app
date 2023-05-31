import {describe, jest} from '@jest/globals';
jest.useFakeTimers();

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const listWithThreeBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]
const listWithTwoBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 7,
    __v: 0
  }
]

const dummy = (blogs) => {
    return 1;
};
const totalLikes = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0 
    : array.length === 1
    ? array[0].likes
    : array.reduce(reducer, 0);
};
const favoriteBlog = (array) => {
  const allLikes = array.map((item) => item.likes);
  const biggestNumberOfLikes = Math.max(...allLikes);
  const favoriteBlog = array.filter((item) => item.likes === biggestNumberOfLikes);
  return favoriteBlog[0];
}

describe('first', () => { 
  test('dummy returns one', () => {
    const blogs = [];
    
    const result = dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('total likes', () => {

test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(5);
});

test('total likes of 3 items in array', () => {
  const result = totalLikes(listWithThreeBlogs);
  expect(result).toBe(24);
});
});

describe('favorite blog', () => {

  test('list with one blog', () => {
    const result = favoriteBlog(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog[0]);
  });

  test('list with three blogs', () => {
    const result = favoriteBlog(listWithThreeBlogs);
    expect(result).toEqual(listWithThreeBlogs[2]);
  });

  test('list of blogs with two good results', () => {
    const result = favoriteBlog(listWithTwoBlogs);
    expect(result).toEqual(listWithTwoBlogs[0] || listWithTwoBlogs[1]);
  })
});
