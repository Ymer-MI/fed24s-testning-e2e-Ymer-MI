import { IMovie } from './models/Movie'

export const movieSort = (movies: IMovie[], asc: boolean = true) => movies.sort((a, b) => asc ? a.Title.localeCompare(b.Title) : b.Title.localeCompare(a.Title))