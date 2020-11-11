const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
        },
        'css-loader'
    ]
    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOption = preset => {

    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
      }

      if(preset) {
          options.presets.push(preset)
      }

    return options
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOption()
    }]

    /* if(isDev) {
        loaders.push('eslint-loader')
    } */
    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // Контекст, для установки абсолютного пути для всех файлов
    mode: 'development', // Тип сборки (development/production)
    entry: ['@babel/polyfill', './index.js'], // Входной файл для webpack   
    output: {
        filename: filename('.js'), //Исходный файл
        path: path.resolve(__dirname, 'dist') // Путь, где должен быть исходный файл
    },
    resolve: {
      extensions: ['.js', '.json', '.jpg'],
      alias: {
          '@models': path.resolve(__dirname, 'src/models'),
          '@': path.resolve(__dirname, 'src')
      }
    },
    optimization: optimization(),
    devServer: {
        port: 4200
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
        new HtmlWebpackPlugin({ // Плагин, для автоматической вставки js файлов в HTML
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(), // Очищает папку dist, после каждой сборки
        /* new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }), */
        new MiniCssExtractPlugin({
            filename: filename('.css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            /* {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: babelOption('@babel/preset-typescript')
                }
            }, */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: babelOption('@babel/preset-react')
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            /* {
                test: /\.(jpg|png|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            } */
            /* {
                test: /\.xml$/,
                use: ['xml-loader']
            }, */
            
            /* {
                test: /\.csv$/,
                use: ['csv-loader'] // для работы требуется пакет papaparse
            } */
        ]
    }
}