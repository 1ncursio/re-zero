import optimizeImage from '@lib/optimizeImage';

describe('optimizeImage', () => {
  test('https URL 테스트', () => {
    const TEST_IMAGE_URL = 'https://test.com/test.jpg';
    expect(optimizeImage(TEST_IMAGE_URL)).toEqual(TEST_IMAGE_URL);
  });

  test('이미지 이름 테스트', () => {
    const TEST_IMAGE_URL = 'test.jpg';
    expect(optimizeImage(TEST_IMAGE_URL)).toEqual(`http://localhost:8000/storage/images/${TEST_IMAGE_URL}`);
  });
});
