import React from 'react';
import TagListRoutes from '../tags/TagListRoutes';
import BooksList from './BooksList';

const BooksListRoutes = () => <TagListRoutes List={BooksList} />;

export default BooksListRoutes;
