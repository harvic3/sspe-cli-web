# SSPE

> CLI Web application to process text files with numbers in seven-segment format in three lines. 

> You can see this in <a href="https://sspengine.now.sh/" target="_blank">Go to app</a>

```console
$ sspe showme
executing with EXAMPLE file... ✏️
File data:
 _       _   _   _       _   _   _   _       _
  |   | |_|   | |_| |_| |_  |_| |_| |_|   | |_|
  |   | |_|   |   |   |  _| |_|   | |_|   |   |

String number:
718794589819
```

## Environment

> This application was made in VueJs framework.

## Installation

- Clone the repository

```console
npm install
```

```console
npm run serve
```

## Machine learning (is experimental)

> Use a neural network (LSTM) to process the text files and throw a string with the result equivalent to the number contained in seven-segment format within the file.

> With neural network you can process files with the last training done.

## Usage

- Get help

```console
sspe hi
```

- Run process with example file

```console
sspe showme
```

- Create a file with seven-segments format

```console
sspe create --name theFileName --number 654123
```

- List the created files

```console
sspe list
```

- Select a file of list for process

```console
sspe select --name Foo.dat
```

- Add data for train the neural network

```console
sspe ml --add 654123 OR sspe m --add auto
```

- Select a file of list for process with Neural network. File of list from 'sspe list'

```console
sspe ml --path Foo.txt
```
