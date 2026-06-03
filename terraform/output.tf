output "cloudfront_domain" {
  value = aws_cloudfront_distribution.react_app.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.react_app.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.react_app.id
}