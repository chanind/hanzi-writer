require 'json'

output_folder = File.join(File.dirname(__FILE__), 'data')
input_file = File.join(File.dirname(__FILE__),'zdtStrokeData.txt')

output = {}
File.readlines(input_file).each do |line|
  char = line[0]
  pathsString = line[2..-1]
  output[char] = pathsString.split("\t").map{|data| data.gsub("\n", '')}
end

output.each do |char, data|
  File.open(File.join(output_folder, "#{char}.json"), 'w') {|file| file.write(data.to_json) }
end

# combined data.js file
File.open(File.join(output_folder, 'all.json'), 'w') {|file| file.write(output.to_json) }
File.open(File.join(output_folder, 'all.js'), 'w') {|file| file.write('window.hanziData = ' + output.to_json) }