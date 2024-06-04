import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from '../../utils/http/http';  
import { getUser } from '../../utils/userStorage';

jest.mock('../../utils/userStorage');

describe('API module', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('get function should fetch data correctly', async () => {
    const mockData = { data: 'mockData' };
    mock.onGet('http://139.144.63.238/MapApi/test').reply(200, mockData);

    const response = await api.get('/test');
    expect(response).toEqual(mockData);
  });

  test('post function should post data correctly', async () => {
    const postData = { key: 'value' };
    const mockResponse = { data: 'mockResponse' };
    mock.onPost('http://139.144.63.238/MapApi/test', postData).reply(200, mockResponse);

    const response = await api.post('/test', postData);
    expect(response).toEqual(mockResponse);
  });

  test('put function should update data correctly', async () => {
    const putData = { key: 'newValue' };
    const mockResponse = { data: 'mockResponse' };
    mock.onPut('http://139.144.63.238/MapApi/test', putData).reply(200, mockResponse);

    const response = await api.put('/test', putData);
    expect(response).toEqual(mockResponse);
  });

  test('delete function should delete data correctly', async () => {
    const mockResponse = { data: 'mockResponse' };
    mock.onDelete('http://139.144.63.238/MapApi/test').reply(200, mockResponse);

    const response = await api.delete('/test');
    expect(response).toEqual(mockResponse);
  });

  test('getOptions should add Authorization header if token exists', async () => {
    getUser.mockResolvedValue({ token: 'mockToken' });

    const options = await api.getOptions({});
    expect(options.headers.Authorization).toBe('Bearer mockToken');
  });

  test('getOptions should set default headers', async () => {
    getUser.mockResolvedValue({ token: 'mockToken' });

    const options = await api.getOptions({});
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers.Authorization).toBe('Bearer mockToken');
  });
});
