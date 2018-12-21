const download = require('image-downloader')
const axios = require('axios')

function startDownload(url) {
    console.log(`Downloading: ${url}`);
    download.image({
            url,
            dest: './images'
        })
        .then(({
            filename,
            image
        }) => {
            console.log('File saved to', filename)
        })
        .catch((err) => {
            console.error(err)
        })
}

async function getImageDownloadUrls(cb) {
    const url = 'https://www.sbth.co/services/api/json/1.4.0/?galleryType=album&albumId=185547263&albumKey=fWJCcD&nodeId=BPDSZG&PageNumber=0&imageId=0&imageKey=&returnModelList=true&PageSize=300&method=rpc.gallery.getalbum';
    const imageUrls = [];
    const response = await axios.get(url);
    const data = await response.data;
    if (data.error) {
        console.log('Errored out');
        return;
    }

    if (data && data.Images) {
        data.Images.forEach(img => {
            const {
                GalleryUrl,
                UrlSignature,
                URLFilename
            } = img;
            imageUrls.push(`${GalleryUrl}/0/${UrlSignature}/X3/${URLFilename}-X3.jpg`);
        });
    }
    return imageUrls;
}

async function execute() {

    const imageUrls = await getImageDownloadUrls();

    console.log('Got the Images: ');
    console.log(imageUrls);

    imageUrls.forEach(imgUrl => {
        startDownload(imgUrl); 
    });
}

execute();