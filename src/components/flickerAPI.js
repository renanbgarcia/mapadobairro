class flickerAPI {

    setLatLon(lat, lon) {
        this.lat = lat
        this.lon = lon
    }

    searchPhotos() {
        return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6dc9ce8f461def92c837b05ba8855331&lat=${this.lat}&lon=${this.lon}&radius=1&per_page=10&tags=street,travel,via&format=json&nojsoncallback=1`)
            .then((response) => response.json() )
            .then((data) => data.photos.photo.map(
                (photo) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`)
            )
    }
}

export default flickerAPI