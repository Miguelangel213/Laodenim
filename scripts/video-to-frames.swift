// Convierte un video en una secuencia de JPG para animar con el scroll.
// Uso: swift scripts/video-to-frames.swift entrada.mp4 site/public/garment-360 90
import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else { print("Uso: swift video-to-frames.swift video.mp4 carpeta_salida [cuadros=90]"); exit(1) }
let count = args.count > 3 ? Int(args[3]) ?? 90 : 90
let out = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
gen.appliesPreferredTrackTransform = true
gen.maximumSize = CGSize(width: 1280, height: 1280)
let dur = CMTimeGetSeconds(asset.duration)

for i in 0..<count {
    let t = CMTime(seconds: Double(i) / Double(count - 1) * (dur - 0.05), preferredTimescale: 600)
    guard let img = try? gen.copyCGImage(at: t, actualTime: nil) else { continue }
    let data = NSBitmapImageRep(cgImage: img).representation(using: .jpeg, properties: [.compressionFactor: 0.6])!
    try? data.write(to: out.appendingPathComponent(String(format: "f%03d.jpg", i + 1)))
}
try? "{\"count\": \(count)}".write(to: out.appendingPathComponent("manifest.json"), atomically: true, encoding: .utf8)
print("Listo: \(count) cuadros en \(out.path)")
