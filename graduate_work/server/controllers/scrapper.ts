import fetch from "node-fetch";
import cheerio from 'cheerio';
import { Request, Response } from 'express';

const scrapper = async (req: Request, res: Response) => {
    const url = `https://mgberon.com/`;
    console.log(`goes here`);
    const response = await fetch(url)
    const html = await response.text();
    console.log(`html`, html);
    const $ = cheerio.load(html);
    const title = $('title').text();
    const date = $('.fusion-date').text();
    const monthYear = $('.fusion-month-year').text();

    console.log(`date/monthYear`, date, monthYear);

    res.status(200).json({ status: 200, title, date, monthYear });
}


export default {
    scrapper
};