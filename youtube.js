async function example() {
    const yt = await data.youtube('never gonna give you up');
    const json = JSON.parse(yt);

    //url, title, status, search, thumbnail, duration, upload_time, views, uploader, uploader_url
    console.log(json.url);
}