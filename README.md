# Alveolus Analysis - Web-based Application User Guide

This README contains a user guide for the Alveolus Analysis web-based application. It also includes instructions for installing the software, processing your own image data set, and running the tool locally.

We provide a Web Demonstration of the system which includes data for two pre-processed experiments. This demonstration may be found at the link below:

[**_Link to Web Demonstration of System_**](https://dyushen.github.io/CS529_final_project/)

---

## Table of Contents  
[**User Guide**](#using-the-web-application)  
[**Setup Instructions**](#setting-up-locally-for-your-own-use)
* [Clone The Repository](#cloning-the-repository)
* [Data Preprocessing](#data-preprocessing)
* [Running the Web-based Application](#setting-up-locally-for-your-own-use)
* [Setup Instructions](#setting-up-locally-for-your-own-use)

[**Libraries and Tools Used**](#libraries-and-tools)

---

##  Using the Web-based Application

---

##  Setting up locally for your own use

This section will describe the steps to download the code of the project to your machine, pre-process your own data, and load it into the application

### Cloning the repository

You can download the code for this project by cloning the repository to your machine:

```console
git clone https://github.com/dyushen/CS529_final_project.git
```

### Data Preprocessing

```console
python preprocess.py -m -p ./path/to/images/ -h 35 -t 7 -s 21 -g 11 -r 5 -a 15 -e 45 -w 7 -n 21 -d 4 -o 1 -l 10 -z 20
```
or
```console
python preprocess.py --manual_mode --img_path ./path/to/images/ --h_alv 35 --tws_alv 7 --sws_alv 21 --gbks 11 --thresh 5 --min_area 15 --h_neut 45 --tws_neut 7 --sws_neut 21 --dks 4 --ff_window 1 --ff_loc_sense 10 --ff_size_sens 20
```

#### Assumptions Made by Preprocessing Tool

The preprocessing tool makes several assumptions regarding the format of the stored data and where the outputs will be saved. Please ensure that the necessary steps are completed before running the above command(s). The assumptions are described below.

- Images are divided into two channels: ch2 and ch4, stored in two separate directories. These directories must be named exactly "ch2" and "ch4".
- Images are saved in the ".ome.tif" format and the archive is named following this general format: ```<text>_Ch<2,4>_000001.ome.tif```
- A directory named "combo" exists in the provided image directory.

#### Input Image Data Examples

Below is an example of the input data for each `ch2` anc `ch4` image type. Note: the `ch4` image is very dark and has compression artifacts as shown below in .PNG format.

| `ch2` image (Alveoli) | `ch4` image (Neutrophil) |
| ----------- | ----------- | 
| ![ch2](https://user-images.githubusercontent.com/15022659/187831098-0c5446a3-5595-4970-8721-ca48d8a81ba6.png) | ![ch4](https://user-images.githubusercontent.com/15022659/187831123-dfc328f9-23c5-4568-9af8-5095c9a62d6f.png) |


#### Tuning Processing Hyperparameters

| Name                                      | Abbreviation.    | Shorthand | Feature Processing Stage (**extraction** or **filtering**) | Recommended Initial Value | Description |
| ----------------------------------------- | ---------------- | --------- | ---------------------------------------------------------- | ------------------------- | ----------- |
| Denoising Filter Strength (Alveoli)       | `--h_alv`        | `-h`      | extraction | 35 | removes noise from images but can also remove image details if set too high |
| Template Size (Alveoli)                   | `--tws_alv`      | `-t`      | extraction | 7  | must be odd number; area to calculate denoising operation, so a smaller value will focus on eliminating fine noise |
| Search Size (Alveoli)                     | `--sws_alv`      | `-s`      | extraction | 21 | must be odd number; area to calculate averaging operation, so a smaller value will only use very close regions of image to fill in noise |
| Blur Kernel Size                          | `--gbks`         | `-g`      | extraction | 11 | must be odd number; area to blur image to further eliminate holes/edges caused by noise |
| Threshold                                 | `--thresh`       | `-r`      | extraction | 5  | limit pixel intensity to keep in image, effectively eliminates noisy pixels leftover by the denoising and blurring operations |
| Min Area                                  | `--min_area`     | `-a`      | extraction | 15 | minimum area a detected region must have in order to be maintained as a detected feature (**highly dependent on quality of videos**) |
| Denoising Filter Strength _(Neutrophil)_  | `--h_neut`       | `-e`      | extraction | 45 | removes noise from images but can also remove image details if set too high |
| Template Size _(Neutrophil)_              | `--tws_neut`     | `-w`      | extraction | 7  | must be odd number; area to calculate denoising operation, so a smaller value will focus on eliminating fine noise |
| Search Size _(Neutrophil)_                | `--sws_neut`     | `-n`      | extraction | 21 | must be odd number; area to calculate averaging operation, so a smaller value will only use very close regions of image to fill in noise
| Dilate Kernel Size _(Neutrophil)_         | `--dks`          | `-d`      | extraction | 4  | slightly expands detected neutrophil pixels to more accurately represent actual neutrophil areas
| Feature Filter Window                     | `--ff_window`    | `-o`      | filtering  | 1  | how many frames features must persist across (unidirectional) in both size and location
| Filter Location Sensitivity               | `--ff_loc_sens`  | `-l`      | filtering  | 10 | how close feature centers should be in neighboring frames to be counted as the same, note that the unit here is pixels
| Filter Size Sensitivity                   | `--ff_size_sens` | `-z`      | filtering  | 20 | how close feature areas should be in neighboring frames to be counted as the same, note that the unit here is (approximately) square pixels


### Setting Up Your Application

a

---

## Libraries and Tools

Libraries Used for the implementation of the web-based application:

- d3.js ([LICENSE](https://github.com/d3/d3/blob/master/LICENSE)): [https://d3js.org/](https://d3js.org/)
- Popper ([LICENSE](https://github.com/popperjs/popper-core/blob/master/LICENSE.md)): [https://popper.js.org/](https://popper.js.org/)
- Tippy.js ([LICENSE](https://github.com/atomiks/tippyjs/blob/master/LICENSE)): [https://atomiks.github.io/tippyjs/](https://atomiks.github.io/tippyjs/)
- FontAwesome Icons ([LICENSE](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt)): [https://fontawesome.com/](https://fontawesome.com/)
- favicon.io ([LICENSE](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS)): [https://favicon.io](https://favicon.io/emoji-favicons/lungs/)
