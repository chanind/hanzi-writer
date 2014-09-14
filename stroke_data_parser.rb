require 'json'

output_file = File.join(File.dirname(__FILE__), 'src/data.js')
input_file = File.join(File.dirname(__FILE__),'zdtStrokeData.txt')

output = {}
File.readlines(input_file).each do |line|
  char = line[0]
  pathsString = line[2..-1]
  output[char] = pathsString.split("\t")
end

File.open(output_file, 'w') {|file| file.write('window.hanziData = ' + output.to_json) }