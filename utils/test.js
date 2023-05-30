import {jest} from '@jest/globals';
jest.useFakeTimers();

import {dummy} from './list_helper.js';

test('dummy returns one', () => {
    const blogs = [];
  
    const result = dummy(blogs);
    expect(result).toBe(1);
  });