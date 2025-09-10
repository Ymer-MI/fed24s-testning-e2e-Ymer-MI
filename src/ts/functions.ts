import { IMovie } from './models/Movie'

export const movieSort = (movies: IMovie[], asc: boolean = true) => movies.sort((a: IMovie, b: IMovie) => asc ? a.Title.localeCompare(b.Title) : b.Title.localeCompare(a.Title))