import { describe, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getUploadUrl,
  profileAPI,
  skillsAPI,
  categorySettingsAPI,
  projectsAPI,
  workExperienceAPI,
  educationAPI,
  contactInfoAPI,
  hobbiesAPI,
  testimonialsAPI,
  contactMessagesAPI,
  resumesAPI,
} from '../services/api';

vi.mock('axios');

describe('api service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getUploadUrl', () => {
    test('returns falsy values as-is', () => {
      expect(getUploadUrl(null)).toBeNull();
      expect(getUploadUrl(undefined)).toBeUndefined();
      expect(getUploadUrl('')).toBe('');
    });

    test('returns absolute URLs unchanged', () => {
      expect(getUploadUrl('https://example.com/img.png')).toBe('https://example.com/img.png');
      expect(getUploadUrl('http://example.com/img.png')).toBe('http://example.com/img.png');
    });

    test('prepends backend URL to paths starting with /', () => {
      const result = getUploadUrl('/uploads/projects/img.png');
      expect(result).toContain('/uploads/projects/img.png');
    });

    test('prepends backend URL to paths without leading /', () => {
      const result = getUploadUrl('uploads/projects/img.png');
      expect(result).toContain('/uploads/projects/img.png');
    });
  });

  describe('profileAPI', () => {
    test('get calls axios.get', () => {
      axios.get.mockResolvedValue({ data: {} });
      profileAPI.get();
      expect(axios.get).toHaveBeenCalledWith('/api/profile');
    });

    test('update calls axios.put', () => {
      axios.put.mockResolvedValue({ data: {} });
      profileAPI.update({ nameEn: 'Test' });
      expect(axios.put).toHaveBeenCalledWith('/api/profile', { nameEn: 'Test' });
    });
  });

  describe('skillsAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); skillsAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/skills'); });
    test('getById', () => { axios.get.mockResolvedValue({}); skillsAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/skills/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); skillsAPI.create({ name: 'X' }); expect(axios.post).toHaveBeenCalledWith('/api/skills', { name: 'X' }); });
    test('update', () => { axios.put.mockResolvedValue({}); skillsAPI.update('1', { name: 'Y' }); expect(axios.put).toHaveBeenCalledWith('/api/skills/1', { name: 'Y' }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); skillsAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/skills/1'); });
  });

  describe('categorySettingsAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); categorySettingsAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/category-settings'); });
    test('updateAll', () => { axios.put.mockResolvedValue({}); categorySettingsAPI.updateAll([{ a: 1 }]); expect(axios.put).toHaveBeenCalledWith('/api/category-settings', { settings: [{ a: 1 }] }); });
  });

  describe('projectsAPI', () => {
    test('getAll without featured', () => { axios.get.mockResolvedValue({}); projectsAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/projects'); });
    test('getAll with featured', () => { axios.get.mockResolvedValue({}); projectsAPI.getAll(true); expect(axios.get).toHaveBeenCalledWith('/api/projects?featured=true'); });
    test('getById', () => { axios.get.mockResolvedValue({}); projectsAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/projects/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); projectsAPI.create({ t: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/projects', { t: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); projectsAPI.update('1', { t: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/projects/1', { t: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); projectsAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/projects/1'); });
    test('uploadImage', () => {
      axios.post.mockResolvedValue({});
      const fd = new FormData();
      projectsAPI.uploadImage(fd);
      expect(axios.post).toHaveBeenCalledWith('/api/projects/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    });
  });

  describe('workExperienceAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); workExperienceAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/work-experience'); });
    test('getById', () => { axios.get.mockResolvedValue({}); workExperienceAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/work-experience/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); workExperienceAPI.create({ c: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/work-experience', { c: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); workExperienceAPI.update('1', { c: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/work-experience/1', { c: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); workExperienceAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/work-experience/1'); });
  });

  describe('educationAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); educationAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/education'); });
    test('getById', () => { axios.get.mockResolvedValue({}); educationAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/education/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); educationAPI.create({ d: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/education', { d: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); educationAPI.update('1', { d: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/education/1', { d: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); educationAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/education/1'); });
  });

  describe('contactInfoAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); contactInfoAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/contact-info'); });
    test('getById', () => { axios.get.mockResolvedValue({}); contactInfoAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/contact-info/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); contactInfoAPI.create({ e: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/contact-info', { e: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); contactInfoAPI.update('1', { e: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/contact-info/1', { e: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); contactInfoAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/contact-info/1'); });
  });

  describe('hobbiesAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); hobbiesAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/hobbies'); });
    test('getById', () => { axios.get.mockResolvedValue({}); hobbiesAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/hobbies/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); hobbiesAPI.create({ f: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/hobbies', { f: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); hobbiesAPI.update('1', { f: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/hobbies/1', { f: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); hobbiesAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/hobbies/1'); });
    test('uploadImage', () => {
      axios.post.mockResolvedValue({});
      const fd = new FormData();
      hobbiesAPI.uploadImage(fd);
      expect(axios.post).toHaveBeenCalledWith('/api/hobbies/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    });
  });

  describe('testimonialsAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); testimonialsAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/testimonials'); });
    test('getById', () => { axios.get.mockResolvedValue({}); testimonialsAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/testimonials/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); testimonialsAPI.create({ g: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/testimonials', { g: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); testimonialsAPI.update('1', { g: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/testimonials/1', { g: 2 }); });
    test('approve', () => { axios.post.mockResolvedValue({}); testimonialsAPI.approve('1'); expect(axios.post).toHaveBeenCalledWith('/api/testimonials/1/approve'); });
    test('reject', () => { axios.post.mockResolvedValue({}); testimonialsAPI.reject('1'); expect(axios.post).toHaveBeenCalledWith('/api/testimonials/1/reject'); });
    test('delete', () => { axios.delete.mockResolvedValue({}); testimonialsAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/testimonials/1'); });
  });

  describe('contactMessagesAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); contactMessagesAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/contact-messages'); });
    test('getById', () => { axios.get.mockResolvedValue({}); contactMessagesAPI.getById('1'); expect(axios.get).toHaveBeenCalledWith('/api/contact-messages/1'); });
    test('create', () => { axios.post.mockResolvedValue({}); contactMessagesAPI.create({ h: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/contact-messages', { h: 1 }); });
    test('update', () => { axios.put.mockResolvedValue({}); contactMessagesAPI.update('1', { h: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/contact-messages/1', { h: 2 }); });
    test('markAsRead', () => { axios.post.mockResolvedValue({}); contactMessagesAPI.markAsRead('1'); expect(axios.post).toHaveBeenCalledWith('/api/contact-messages/1/read'); });
    test('markAsUnread', () => { axios.post.mockResolvedValue({}); contactMessagesAPI.markAsUnread('1'); expect(axios.post).toHaveBeenCalledWith('/api/contact-messages/1/unread'); });
    test('delete', () => { axios.delete.mockResolvedValue({}); contactMessagesAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/contact-messages/1'); });
    test('getUnreadCount', () => { axios.get.mockResolvedValue({}); contactMessagesAPI.getUnreadCount(); expect(axios.get).toHaveBeenCalledWith('/api/contact-messages/unread-count'); });
  });

  describe('resumesAPI', () => {
    test('getAll', () => { axios.get.mockResolvedValue({}); resumesAPI.getAll(); expect(axios.get).toHaveBeenCalledWith('/api/resumes'); });
    test('getCurrentByLanguage', () => { axios.get.mockResolvedValue({}); resumesAPI.getCurrentByLanguage('en'); expect(axios.get).toHaveBeenCalledWith('/api/resumes/current/en'); });
    test('download returns URL string', () => {
      const url = resumesAPI.download('r1');
      expect(url).toBe('/api/resumes/r1/download');
    });
    test('create', () => { axios.post.mockResolvedValue({}); resumesAPI.create({ i: 1 }); expect(axios.post).toHaveBeenCalledWith('/api/resumes', { i: 1 }); });
    test('upload', () => {
      axios.post.mockResolvedValue({});
      const fd = new FormData();
      resumesAPI.upload(fd);
      expect(axios.post).toHaveBeenCalledWith('/api/resumes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    });
    test('update', () => { axios.put.mockResolvedValue({}); resumesAPI.update('1', { i: 2 }); expect(axios.put).toHaveBeenCalledWith('/api/resumes/1', { i: 2 }); });
    test('delete', () => { axios.delete.mockResolvedValue({}); resumesAPI.delete('1'); expect(axios.delete).toHaveBeenCalledWith('/api/resumes/1'); });
  });
});
